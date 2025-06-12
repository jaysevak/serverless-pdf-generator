/**
 * Local test script for the Lambda function
 */
const { handler } = require('./index');
const fs = require('fs');

async function testProcessForm() {
  console.log('Testing form processing...');
  
  // Read test form data
  const formData = JSON.parse(fs.readFileSync('./test-form.json', 'utf8'));
  
  // Create mock event
  const event = {
    body: JSON.stringify(formData),
    path: '/process-form'
  };
  
  // Call handler
  const response = await handler(event);
  console.log('Response:', response);
  
  return JSON.parse(response.body).applicationId;
}

async function testGeneratePDF(applicationId) {
  console.log('\nTesting PDF generation...');
  
  // Read test PDF data
  const pdfData = JSON.parse(fs.readFileSync('./test-pdf.json', 'utf8'));
  
  // Update with application ID if provided
  if (applicationId) {
    pdfData.applicationId = applicationId;
  }
  
  // Create mock event
  const event = {
    body: JSON.stringify(pdfData),
    path: '/generate-pdf'
  };
  
  // Call handler
  const response = await handler(event);
  console.log('PDF generated successfully');
  
  // Save PDF to file
  const responseBody = JSON.parse(response.body);
  const pdfBuffer = Buffer.from(responseBody.pdf, 'base64');
  fs.writeFileSync(responseBody.filename, pdfBuffer);
  console.log(`PDF saved as ${responseBody.filename}`);
}

// Run tests
(async () => {
  try {
    // Mock SNS for local testing
    process.env.SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:test-topic';
    
    // Test form processing
    const applicationId = await testProcessForm();
    
    // Test PDF generation
    await testGeneratePDF(applicationId);
  } catch (error) {
    console.error('Test failed:', error);
  }
})();