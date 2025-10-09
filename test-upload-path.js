// Test script to verify UPLOAD_PATH configuration
const path = require('path');
const fs = require('fs');

// Test different upload paths
const testPaths = [
  'uploads',
  'media-files',
  'user-content',
  'temp-uploads'
];

console.log('Testing UPLOAD_PATH configuration...\n');

testPaths.forEach(uploadPath => {
  console.log(`Testing path: ${uploadPath}`);
  
  // Simulate the path creation logic from the controller
  const uploadsDir = path.join(process.cwd(), uploadPath);
  console.log(`  Full path: ${uploadsDir}`);
  
  // Check if directory exists
  if (fs.existsSync(uploadsDir)) {
    console.log(`  ✅ Directory exists`);
  } else {
    console.log(`  ❌ Directory does not exist`);
    console.log(`  📁 Would create directory: ${uploadsDir}`);
  }
  
  // Test URL generation
  const testFile = 'test-file.jpg';
  const fileUrl = `/${uploadPath}/${testFile}`;
  console.log(`  🔗 Generated URL: ${fileUrl}`);
  
  console.log('');
});

console.log('Configuration test completed!');
console.log('\nTo use a custom upload path, set the UPLOAD_PATH environment variable:');
console.log('export UPLOAD_PATH=my-custom-uploads');
console.log('or add to your .env file:');
console.log('UPLOAD_PATH=my-custom-uploads');
