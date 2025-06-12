# API Gateway Setup Guide

This guide provides step-by-step instructions with screenshots for creating resources and methods in API Gateway.

## Creating the Process Form Resource and Method

### Step 1: Create Resource
![Create Resource](https://i.imgur.com/1JYZnQs.png)
1. In the API Gateway console, select your API
2. Click the "Actions" dropdown button
3. Select "Create Resource"

### Step 2: Configure Resource
![Configure Resource](https://i.imgur.com/2XYZnQs.png)
1. Enter "process-form" as the Resource Name
2. The Resource Path will automatically be set to "/process-form"
3. Leave other settings as default
4. Click "Create Resource"

### Step 3: Create Method
![Create Method](https://i.imgur.com/3JYZnQs.png)
1. With the "/process-form" resource selected
2. Click the "Actions" dropdown button
3. Select "Create Method"

### Step 4: Select Method Type
![Select Method Type](https://i.imgur.com/4JYZnQs.png)
1. From the dropdown menu, select "POST"
2. Click the checkmark to confirm

### Step 5: Configure Method
![Configure Method](https://i.imgur.com/5JYZnQs.png)
1. For Integration type, select "Lambda Function"
2. Check "Lambda Proxy integration" (optional, but recommended)
3. Select the Lambda Region where your function is deployed
4. In the Lambda Function field, type "formHandler"
5. As you type, your function should appear in the dropdown
6. Click "Save"

### Step 6: Grant Permission
![Grant Permission](https://i.imgur.com/6JYZnQs.png)
1. A popup will appear asking for permission to invoke the Lambda function
2. Click "OK" to grant permission

## Creating the Generate PDF Resource and Method

### Step 1: Create Resource
1. Click the "Actions" dropdown button
2. Select "Create Resource"

### Step 2: Configure Resource
1. Enter "generate-pdf" as the Resource Name
2. The Resource Path will automatically be set to "/generate-pdf"
3. Leave other settings as default
4. Click "Create Resource"

### Step 3: Create Method
1. With the "/generate-pdf" resource selected
2. Click the "Actions" dropdown button
3. Select "Create Method"

### Step 4: Select Method Type
1. From the dropdown menu, select "POST"
2. Click the checkmark to confirm

### Step 5: Configure Method
1. For Integration type, select "Lambda Function"
2. Check "Lambda Proxy integration" (optional, but recommended)
3. Select the Lambda Region where your function is deployed
4. In the Lambda Function field, type "formHandler" (same function as before)
5. Click "Save"

### Step 6: Grant Permission
1. A popup will appear asking for permission to invoke the Lambda function
2. Click "OK" to grant permission

## Testing Your API

### Test the Process Form Endpoint
1. Select the POST method under /process-form
2. Click the "Test" tab
3. In the Request Body, paste the contents of test-form.json
4. Click "Test"
5. Verify you get a successful response

### Test the Generate PDF Endpoint
1. Select the POST method under /generate-pdf
2. Click the "Test" tab
3. In the Request Body, paste the contents of test-pdf.json
4. Click "Test"
5. Verify you get a successful response with PDF data