// Simple API-based upload to Cloudinary via Next.js API route
interface ApiUploadResult {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  publicId?: string;
  error?: string;
}

export const uploadViaAPI = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<ApiUploadResult> => {
  return new Promise((resolve) => {
    try {
      console.log('Starting upload:', file.name, file.size);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log('Upload progress:', progress + '%');
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('📤 Upload completed, status:', xhr.status);
        console.log('📄 Response:', xhr.responseText);
        
        // Check if request was successful
        if (xhr.status < 200 || xhr.status >= 300) {
          console.error('❌ Upload failed with status:', xhr.status);
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}: ${xhr.responseText}`
          });
          return;
        }
        
        try {
          const result = JSON.parse(xhr.responseText);
          console.log('✅ Parsed result:', result);
          resolve(result);
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError);
          console.error('Response text:', xhr.responseText);
          resolve({
            success: false,
            error: `Server returned invalid JSON (status ${xhr.status})`
          });
        }
      });

      xhr.addEventListener('error', (event) => {
        console.error('❌ Network error during upload:', event);
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      });

      console.log('Sending request to /api/upload');
      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      resolve({
        success: false,
        error: 'Upload failed. Please try again.'
      });
    }
  });
};
