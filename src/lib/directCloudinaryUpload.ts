// Direct upload to Cloudinary from browser (bypasses Next.js API route)
// This removes file size limitations from your server

interface DirectUploadResult {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  publicId?: string;
  error?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  asset_id: string;
  signature: string;
  [key: string]: unknown;
}

export const uploadDirectlyToCloudinary = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<DirectUploadResult> => {
  return new Promise((resolve) => {
    try {
      console.log('🚀 Starting direct Cloudinary upload:', file.name, file.size);
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        console.error('❌ Missing Cloudinary configuration');
        resolve({
          success: false,
          error: 'Cloudinary not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env'
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', `future_engineers/${userId}`);
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log('📊 Upload progress:', progress + '%');
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('📤 Upload completed, status:', xhr.status);
        
        if (xhr.status < 200 || xhr.status >= 300) {
          console.error('❌ Upload failed with status:', xhr.status);
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`
          });
          return;
        }
        
        try {
          const result = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          console.log('✅ Cloudinary response:', result);
          
          resolve({
            success: true,
            fileUrl: result.secure_url,
            publicId: result.public_id,
            fileId: result.asset_id
          });
        } catch (parseError) {
          console.error('❌ Failed to parse Cloudinary response:', parseError);
          resolve({
            success: false,
            error: 'Failed to parse upload response'
          });
        }
      });

      xhr.addEventListener('error', () => {
        console.error('❌ Network error during upload');
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      });

      // Direct upload to Cloudinary (no Next.js server involved)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      console.log('📡 Uploading to:', uploadUrl);
      
      xhr.open('POST', uploadUrl);
      xhr.send(formData);

    } catch (error) {
      console.error('❌ Upload error:', error);
      resolve({
        success: false,
        error: 'Upload failed. Please try again.'
      });
    }
  });
};
