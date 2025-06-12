# Creating API Gateway Resources and Methods

This guide provides detailed steps with screenshots for creating resources and methods in API Gateway.

## Step 1: Navigate to API Gateway
1. Sign in to the AWS Management Console
2. Search for "API Gateway" in the search bar
3. Click on "API Gateway" in the search results

## Step 2: Create or Select an API
1. If you haven't created an API yet, click "Create API"
2. Select "REST API" and click "Build"
3. Enter a name for your API (e.g., "FormProcessingAPI")
4. Click "Create API"
5. If you already have an API, select it from the list

## Step 3: Create the Process Form Resource

1. In the left navigation panel, select "Resources"
2. Select the root resource (/) 
3. Click the "Actions" dropdown button
4. Select "Create Resource"
5. In the "New Resource" form:
   - Resource Name: `process-form`
   - Resource Path: `/process-form` (this will be filled automatically)
   - Leave other settings as default
6. Click "Create Resource"

## Step 4: Create POST Method for Process Form

1. With the newly created `/process-form` resource selected
2. Click the "Actions" dropdown button
3. Select "Create Method"
4. A small dropdown will appear under the resource
5. Select "POST" from the dropdown
6. Click the checkmark button to confirm
7. In the "New Method" form:
   - Integration type: `Lambda Function`
   - Use Lambda Proxy integration: Check this box (recommended)
   - Lambda Region: Select your region (e.g., `us-east-1`)
   - Lambda Function: Type `formHandler` and select it from the dropdown
8. Click "Save"
9. A popup will appear asking for permission to invoke the Lambda function
10. Click "OK" to grant permission

## Step 5: Create the Generate PDF Resource

1. Go back to the root resource (/) by clicking on it in the resource tree
2. Click the "Actions" dropdown button
3. Select "Create Resource"
4. In the "New Resource" form:
   - Resource Name: `generate-pdf`
   - Resource Path: `/generate-pdf` (this will be filled automatically)
   - Leave other settings as default
5. Click "Create Resource"

## Step 6: Create POST Method for Generate PDF

1. With the newly created `/generate-pdf` resource selected
2. Click the "Actions" dropdown button
3. Select "Create Method"
4. A small dropdown will appear under the resource
5. Select "POST" from the dropdown
6. Click the checkmark button to confirm
7. In the "New Method" form:
   - Integration type: `Lambda Function`
   - Use Lambda Proxy integration: Check this box (recommended)
   - Lambda Region: Select your region (e.g., `us-east-1`)
   - Lambda Function: Type `formHandler` and select it from the dropdown
8. Click "Save"
9. A popup will appear asking for permission to invoke the Lambda function
10. Click "OK" to grant permission

## Step 7: Enable CORS (Optional but Recommended)

1. Select the `/process-form` resource
2. Click the "Actions" dropdown button
3. Select "Enable CORS"
4. In the "Enable CORS" form:
   - Access-Control-Allow-Origin: `*` (or your specific domain)
   - Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - Access-Control-Allow-Methods: Check "POST"
5. Click "Enable CORS and replace existing CORS headers"
6. Click "Yes, replace existing values"

7. Repeat the same steps for the `/generate-pdf` resource

## Step 8: Deploy the API

1. Click the "Actions" dropdown button
2. Select "Deploy API"
3. In the "Deploy API" form:
   - Deployment stage: Select "[New Stage]"
   - Stage name: `dev` (or any name you prefer)
   - Stage description: Optional
   - Deployment description: Optional
4. Click "Deploy"

## Step 9: Get the API Endpoint URLs

1. In the left navigation panel, select "Stages"
2. Expand the stage you just created (e.g., "dev")
3. Select the `/process-form` resource
4. Note the "Invoke URL" displayed at the top of the page - this is your process form endpoint
5. Select the `/generate-pdf` resource
6. Note the "Invoke URL" displayed - this is your generate PDF endpoint

## Step 10: Test Your API

1. You can test your API directly in the console:
   - Select either the `/process-form` or `/generate-pdf` POST method
   - Click the "Test" tab
   - In the "Request Body" field, paste the appropriate test JSON
   - Click "Test" to see the response

2. Or you can test using tools like Postman or curl:
   ```
   curl -X POST \
     "https://your-api-id.execute-api.region.amazonaws.com/dev/process-form" \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","position":"Software Developer"}'
   ```

## Troubleshooting

- If you get a 500 error, check your Lambda function logs in CloudWatch
- If you get a CORS error when testing from a browser, make sure CORS is properly configured
- If the Lambda function isn't being invoked, check the IAM permissions