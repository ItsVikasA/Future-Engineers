// Test script to verify the corrected Cloudinary URL fixing
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

// Test with the problematic URL you mentioned
const testUrl = 'https://res.cloudinary.com/daf87l22y/raw/upload/fl_attachment/v1757127453/student-notes/QQpJJ9F2USS1b99KdSOG4T1fqj2/file_sw2jr1.pdf';

console.log('🔍 TESTING URL TRANSFORMATION:');
console.log('Original URL:', testUrl);
console.log('View URL:    ', fixCloudinaryUrl(testUrl));
console.log('Download URL:', getDownloadUrl(testUrl));

console.log('\n📁 FOLDER NAME CHANGES:');
console.log('❌ Old folder: student-notes');
console.log('✅ New folder: future_engineers');

// Test with your specific example
const yourTestUrl = 'https://res.cloudinary.com/daf87l22y/image/upload/fl_attachment/v1757127453/student-notes/test.pdf';
console.log('\n🧪 YOUR EXAMPLE:');
console.log('Before:', yourTestUrl);
console.log('After: ', fixCloudinaryUrl(yourTestUrl));
