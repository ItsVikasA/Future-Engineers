// Test the updated URL handling for the new upload format
const fixCloudinaryUrl = (url) => {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Remove problematic fl_attachment parameter that causes access issues
  if (url.includes('fl_attachment/')) {
    url = url.replace('fl_attachment/', '');
  }

  // Fix the folder name from student-notes to future_engineers
  if (url.includes('/student-notes/')) {
    url = url.replace('/student-notes/', '/future_engineers/');
  }

  return url;
};

const getWorkingUrl = (originalUrl) => {
  const fixedUrl = fixCloudinaryUrl(originalUrl);
  
  // For new uploads (auto resource type), try multiple formats
  if (fixedUrl.includes('/raw/upload/')) {
    // Try both raw and image upload paths
    const imageUrl = fixedUrl.replace('/raw/upload/', '/image/upload/');
    return imageUrl; // Try image first as it often works better for PDFs
  }
  
  return fixedUrl;
};

const getDownloadUrl = (url) => {
  const workingUrl = fixCloudinaryUrl(url);
  
  if (workingUrl.includes('cloudinary.com') && workingUrl.includes('.pdf')) {
    // For downloads, keep the original resource type but add fl_attachment
    const parts = workingUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  
  return workingUrl;
};

// Test with the newly uploaded file URL
const newFileUrl = 'https://res.cloudinary.com/daf87l22y/raw/upload/v1757127453/future_engineers/QOpJJ9F2USS1b99KdSOG4T1fqjo2/file_hjther.pdf';

console.log('🧪 NEW UPLOAD URL TESTING:');
console.log('');
console.log('📥 NEW FILE URL:');
console.log(newFileUrl);
console.log('');
console.log('🔧 FIXED FOR VIEWING:');
console.log(getWorkingUrl(newFileUrl));
console.log('');
console.log('📥 DOWNLOAD URL:');
console.log(getDownloadUrl(newFileUrl));
console.log('');
console.log('✨ KEY CHANGES:');
console.log('  1. Upload API now uses resource_type: "auto"');
console.log('  2. URLs saved to future_engineers folder ✓');
console.log('  3. Viewer converts /raw/upload/ → /image/upload/ for better access');
console.log('  4. Downloads keep original resource type with fl_attachment');
console.log('');
console.log('🔍 401 ERROR FIX:');
console.log('  - Changed from resource_type: "raw" to "auto"');
console.log('  - This should resolve the authentication issues');

// Test with old problematic URL for backward compatibility
const oldUrl = 'https://res.cloudinary.com/daf87l22y/raw/upload/fl_attachment/v1757127453/student-notes/test.pdf';
console.log('');
console.log('🔄 OLD URL COMPATIBILITY:');
console.log('Original:', oldUrl);
console.log('Fixed:   ', getWorkingUrl(oldUrl));
