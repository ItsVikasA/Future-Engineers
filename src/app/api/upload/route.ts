import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    console.log('📄 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      userId: userId
    });

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.log('❌ No user ID provided');
      return NextResponse.json(
        { success: false, error: 'No user ID provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Check Cloudinary credentials
    console.log('🔑 Checking Cloudinary credentials...');
    console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('API key exists:', !!process.env.CLOUDINARY_API_KEY);
    console.log('API secret exists:', !!process.env.CLOUDINARY_API_SECRET);
    
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('❌ Cloudinary credentials missing');
      return NextResponse.json(
        { success: false, error: 'Cloudinary not configured.' },
        { status: 500 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    console.log('☁️ Starting Cloudinary upload...');
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        resource_type: 'raw',
        folder: `future_engineers/${userId}`,
        access_mode: 'public',
        use_filename: true,
        unique_filename: true,
      };

      console.log('📁 Upload options:', uploadOptions);

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            console.log('✅ Cloudinary upload success:', {
              public_id: result.public_id,
              secure_url: result.secure_url,
              asset_id: result.asset_id
            });
            resolve(result);
          } else {
            console.error('❌ Cloudinary upload failed - no result');
            reject(new Error('Upload failed'));
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      fileUrl: result.secure_url,
      fileId: result.asset_id,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb' // increase as needed (e.g. '100mb')
    }
  }
};
