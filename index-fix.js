/**
 * Combined AWS Lambda function for form processing and PDF generation
 */
const PDFDocument = require('pdfkit');
const AWS = require('aws-sdk');

// Initialize AWS services
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // Parse the incoming request
    const requestData = JSON.parse(event.body);
    const action = event.path.endsWith('/process-form') ? 'process' : 'generate';
    
    // Process form submission
    if (action === 'process') {
      // Validate required fields
      if (!requestData.name || !requestData.email || !requestData.position) {
        return formatResponse(400, { error: 'Missing required fields' });
      }
      
      // Send notification
      const params = {
        Message: `New job application received:
          Name: ${requestData.name}
          Email: ${requestData.email}
          Position: ${requestData.position}
          Start Date: ${requestData.startDate || 'Not specified'}
        `,
        Subject: 'New Job Application',
        TopicArn: process.env.SNS_TOPIC_ARN
      };
      
      await sns.publish(params).promise();
      
      // Return success with application ID
      return formatResponse(200, {
        message: 'Form submitted successfully',
        applicationId: Date.now().toString(),
        name: requestData.name
      });
    }
    
    // Generate PDF
    else if (action === 'generate') {
      // Validate required fields
      if (!requestData.name || !requestData.position || !requestData.applicationId) {
        return formatResponse(400, { error: 'Missing required fields for PDF generation' });
      }
      
      // Create PDF document
      const doc = new PDFDocument();
      let buffers = [];
      
      // Collect PDF data chunks
      doc.on('data', buffer => buffers.push(buffer));
      
      // Generate PDF content
      doc.fontSize(25).text('Offer Letter', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Dear ${requestData.name},`);
      doc.moveDown();
      doc.text(`We are pleased to offer you the position of ${requestData.position} at CodeLearn.`);
      doc.moveDown();
      doc.text('This offer is contingent upon the successful completion of a background check.');
      doc.moveDown(2);
      doc.text('_______________________', { align: 'right' });
      doc.text('Signature', { align: 'right' });
      
      // Finalize PDF
      doc.end();
      
      // Return PDF as base64
      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          const pdfBase64 = pdfBuffer.toString('base64');
          
          resolve(formatResponse(200, {
            pdf: pdfBase64,
            filename: `offer_letter_${requestData.applicationId}.pdf`
          }));
        });
      });
    }
    
    // Invalid action
    else {
      return formatResponse(400, { error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return formatResponse(500, { error: 'Internal server error' });
  }
};

// Helper function to format API Gateway response
function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}