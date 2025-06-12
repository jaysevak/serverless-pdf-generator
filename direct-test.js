/**
 * Simple Node.js script to test the PDF generation API directly
 * Run with: node direct-test.js
 */
const https = require('https');

// API endpoint
const apiUrl = 'https://b85zjxoud2.execute-api.ap-south-1.amazonaws.com/dev/generate-pdf';

// Test payload
const testPayload = {
  name: "Test User",
  position: "Software Developer",
  applicationId: "12345"
};

// Prepare the request
const data = JSON.stringify(testPayload);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending request to:', apiUrl);
console.log('Payload:', data);

// Make the request
const req = https.request(apiUrl, options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:');
    try {
      const parsedData = JSON.parse(responseData);
      console.log(JSON.stringify(parsedData, null, 2));
      
      // If we got PDF data, save it to a file
      if (parsedData.pdf) {
        console.log('PDF data received! First 100 chars:', parsedData.pdf.substring(0, 100) + '...');
        console.log('Filename:', parsedData.filename);
      }
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

// Send the request
req.write(data);
req.end();