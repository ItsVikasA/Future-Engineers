// Test script to verify Cloudinary URL fixing
const fixCloudinaryUrl = (url) => {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Fix the malformed /raw/upload/ URLs
  if (url.includes('/raw/upload/')) {
    // Convert from /raw/upload/ to /image/upload/ for better PDF handling
    url = url.replace('/raw/upload/', '/image/upload/');
  }

  // Remove problematic fl_attachment parameter that causes access issues
  if (url.includes('fl_attachment/')) {
    url = url.replace('fl_attachment/', '');
  }

  // Ensure proper PDF delivery format
  if (url.includes('.pdf')) {
    // Add fl_attachment for download behavior when needed
    if (!url.includes('fl_attachment')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        url = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }
  }

  return url;
};

// Test with the problematic URL from the screenshot
const testUrl = 'https://res.cloudinary.com/daf87l22y/raw/upload/fl_attachment/v1757127453/student-notes/QQpJJ9F2USS1b99KdSOG4T1fqj2/file_sw2jr1.pdf';

console.log('Original URL:', testUrl);
console.log('Fixed URL:', fixCloudinaryUrl(testUrl));

// Test with another format
const testUrl2 = 'https://res.cloudinary.com/daf87l22y/raw/upload/v1757127453/student-notes/test.pdf';
console.log('\nTest URL 2 Original:', testUrl2);
console.log('Test URL 2 Fixed:', fixCloudinaryUrl(testUrl2));
