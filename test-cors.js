// Simple CORS test script
const https = require('https');

const testCors = () => {
  const options = {
    hostname: 'wesourceyoub2.vercel.app',
    port: 443,
    path: '/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://wesourceyoub2.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    res.on('data', (chunk) => {
      console.log('Response body:', chunk.toString());
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e);
  });

  req.end();
};

console.log('Testing CORS configuration...');
testCors();
