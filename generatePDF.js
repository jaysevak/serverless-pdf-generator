/**
 * AWS Lambda function to generate offer letter PDF
 */
const PDFDocument = require('pdfkit');

exports.handler = async (event) => {
  try {
    // Parse the incoming request
    const requestData = JSON.parse(event.body);
    
    // Validate required fields
    if (!requestData.name || !requestData.position || !requestData.applicationId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Create a PDF document
    const doc = new PDFDocument();
    let buffers = [];
    
    // Collect PDF data chunks
    doc.on('data', buffer => buffers.push(buffer));
    
    // Generate the PDF content
    doc.fontSize(25).text('Offer Letter', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Dear ${requestData.name},`);
    doc.moveDown();
    doc.text(`We are pleased to offer you the position of ${requestData.position} at CodeLearn.`);
    doc.moveDown();
    doc.text('This offer is contingent upon the successful completion of a background check and drug screening.');
    doc.moveDown();
    doc.text('Please sign below to indicate your acceptance of this offer.');
    doc.moveDown(2);
    doc.text('_______________________', { align: 'right' });
    doc.text('Signature', { align: 'right' });
    
    // Finalize the PDF
    doc.end();
    
    // Return the PDF as base64 encoded string when the PDF is complete
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        const pdfBase64 = pdfBuffer.toString('base64');
        
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pdf: pdfBase64,
            filename: `offer_letter_${requestData.applicationId}.pdf`
          })
        });
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};