# Serverless PDF Generator

This project implements a serverless function for form processing and PDF generation using AWS Lambda.

## Features

- Process form submissions securely
- Generate offer letter PDFs on demand
- Stateless architecture with no persistent storage
- CORS-enabled API endpoints

## AWS Console Setup Instructions

### 1. Create SNS Topic

1. Open the AWS Console and navigate to SNS
2. Click "Create topic"
3. Select "Standard" type
4. Name: `JobApplicationNotifications`
5. Click "Create topic"
6. Copy the Topic ARN for later use

### 2. Create Lambda Function

1. Navigate to AWS Lambda
2. Click "Create function"
3. Select "Author from scratch"
4. Name: `formHandler`
5. Runtime: `Node.js 14.x`
6. Architecture: `x86_64`
7. Click "Create function"

### 3. Configure Lambda Function

1. In the function page, scroll to "Code source"
2. Delete the default code in `index.js`
3. Copy and paste the code from our `index.js` file
4. Click "Deploy"

### 4. Add Dependencies

1. In the Lambda function page, click "Layers"
2. Click "Create layer"
3. Name: `pdf-dependencies`
4. Upload a ZIP file containing node_modules with pdfkit and aws-sdk
   ```
   npm install pdfkit aws-sdk
   zip -r layer.zip node_modules
   ```
5. Compatible runtimes: Select `Node.js 14.x`
6. Click "Create"
7. Go back to your function and add this layer

### 5. Configure Environment Variables

1. In the Lambda function page, click "Configuration"
2. Click "Environment variables"
3. Click "Edit"
4. Add key: `SNS_TOPIC_ARN` with value: [Your SNS Topic ARN]
5. Click "Save"

### 6. Configure IAM Permissions

1. In the Lambda function page, click "Configuration"
2. Click "Permissions"
3. Click the role name to open the IAM console
4. Click "Add permissions" > "Create inline policy"
5. Service: `SNS`
6. Actions: `Publish`
7. Resources: Add your SNS Topic ARN
8. Click "Review policy"
9. Name: `SNSPublishPolicy`
10. Click "Create policy"

### 7. Create API Gateway

1. Navigate to API Gateway
2. Click "Create API"
3. Select "REST API" and click "Build"
4. API name: `FormProcessingAPI`
5. Click "Create API"

### 8. Create Resources and Methods

1. Click "Create Resource"
2. Resource Name: `process-form`
3. Click "Create Resource"
4. With `/process-form` selected, click "Create Method"
5. Select `POST` and click the checkmark
6. Integration type: `Lambda Function`
7. Lambda Function: `formHandler`
8. Click "Save"

9. Click "Create Resource" again
10. Resource Name: `generate-pdf`
11. Click "Create Resource"
12. With `/generate-pdf` selected, click "Create Method"
13. Select `POST` and click the checkmark
14. Integration type: `Lambda Function`
15. Lambda Function: `formHandler`
16. Click "Save"

### 9. Enable CORS

1. For each resource (`/process-form` and `/generate-pdf`):
   - Select the resource
   - Click "Actions" > "Enable CORS"
   - Check "Access-Control-Allow-Origin" and enter `*`
   - Click "Enable CORS and replace existing CORS headers"

### 10. Deploy API

1. Click "Actions" > "Deploy API"
2. Deployment stage: [New Stage]
3. Stage name: `dev`
4. Click "Deploy"
5. Note the "Invoke URL" - this is your API endpoint

### 11. Update Frontend

1. Open `frontend-example.html`
2. Update the API_ENDPOINTS object with your API Gateway URLs:
   ```javascript
   const API_ENDPOINTS = {
       processForm: 'https://your-api-id.execute-api.region.amazonaws.com/dev/process-form',
       generatePdf: 'https://your-api-id.execute-api.region.amazonaws.com/dev/generate-pdf'
   };
   ```

## Testing

### Local Testing

1. Install dependencies:
   ```
   npm install
   ```

2. Run the test script:
   ```
   node test.js
   ```

### API Testing

1. Use the provided test JSON files with curl or Postman:
   ```
   curl -X POST -H "Content-Type: application/json" -d @test-form.json https://your-api-id.execute-api.region.amazonaws.com/dev/process-form
   ```

## Deployment with Serverless Framework

If you prefer using the Serverless Framework instead of manual setup:

1. Install Serverless Framework:
   ```
   npm install -g serverless
   ```

2. Configure AWS credentials:
   ```
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   ```

3. Deploy:
   ```
   ./deploy.sh
   ```

## Security Considerations

- All functions are stateless
- No data is stored persistently
- API Gateway provides request validation
- IAM roles limit function permissions