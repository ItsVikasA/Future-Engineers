// Test the new URL handling approach
const fixCloudinaryUrl = (url) => {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Fix the malformed /raw/upload/ URLs by converting to /image/upload/
  if (url.includes('/raw/upload/')) {
    url = url.replace('/raw/upload/', '/image/upload/');
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

const getWorkingUrl = async (originalUrl) => {
  const urls = [
    fixCloudinaryUrl(originalUrl), // Try fixed URL first
    originalUrl, // Try original URL
    originalUrl.replace('/raw/upload/', '/image/upload/'), // Alternative format
    originalUrl.replace('/student-notes/', '/future_engineers/') // Just folder change
  ];

  return urls[0]; // Return the fixed URL for now
};

const getDownloadUrl = (url) => {
  const fixedUrl = fixCloudinaryUrl(url);
  
  if (fixedUrl.includes('cloudinary.com') && fixedUrl.includes('.pdf')) {
    // Add fl_attachment for proper download behavior
    const parts = fixedUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  
  return fixedUrl;
};

// Test with problematic URL
const testUrl = 'https://res.cloudinary.com/daf87l22y/raw/upload/fl_attachment/v1757127453/student-notes/QQpJJ9F2USS1b99KdSOG4T1fqj2/file_sw2jr1.pdf';

console.log('🚀 COMPREHENSIVE URL TESTING:');
console.log('');
console.log('📥 ORIGINAL URL:');
console.log(testUrl);
console.log('');
console.log('🔧 FIXED URL (for viewing):');
console.log(fixCloudinaryUrl(testUrl));
console.log('');
console.log('📥 DOWNLOAD URL (with attachment):');
console.log(getDownloadUrl(testUrl));
console.log('');
console.log('🔄 UPLOAD API NOW SAVES TO:');
console.log('  📁 Folder: future_engineers/{userId}');
console.log('  🔗 Format: /raw/upload/...');
console.log('');
console.log('✅ KEY FIXES:');
console.log('  1. Upload API changed from student-notes → future_engineers');
console.log('  2. PDF viewer handles both old and new folder structures'); 
console.log('  3. URL format conversion: /raw/upload/ → /image/upload/');
console.log('  4. Smart fl_attachment handling for downloads vs viewing');
