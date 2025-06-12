/**
 * AWS Lambda function to process form submissions
 */
const AWS = require('aws-sdk');

// Initialize AWS services
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // Parse the incoming request body
    const formData = JSON.parse(event.body);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.position) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Process the form data (e.g., store in a database, send notification)
    // Here we're just sending an SNS notification
    const params = {
      Message: `New job application received:
        Name: ${formData.name}
        Email: ${formData.email}
        Position: ${formData.position}
        Start Date: ${formData.startDate || 'Not specified'}
      `,
      Subject: 'New Job Application',
      TopicArn: process.env.SNS_TOPIC_ARN
    };
    
    await sns.publish(params).promise();
    
    // Return success response with the ID to use for PDF generation
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Form submitted successfully',
        applicationId: Date.now().toString(), // Simple ID generation
        name: formData.name
      })
    };
  } catch (error) {
    console.error('Error processing form:', error);
    
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