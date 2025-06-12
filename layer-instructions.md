# Creating a Lambda Layer for PDF Dependencies

This guide explains how to create a Lambda Layer containing the required dependencies for PDF generation.

## Option 1: Using the Provided Scripts

### For Linux/Mac:

1. Make the script executable:
   ```
   chmod +x create-layer.sh
   ```

2. Run the script:
   ```
   ./create-layer.sh
   ```

3. The script will create a `layer.zip` file that you can upload to AWS Lambda.

### For Windows:

1. Run the batch script:
   ```
   create-layer.bat
   ```

2. The script will create a `layer.zip` file using 7-Zip (if installed).

## Option 2: Manual Creation

If you prefer to create the layer manually:

1. Create a directory structure for the layer:
   ```
   mkdir -p lambda-layer/nodejs
   cd lambda-layer/nodejs
   ```

2. Create a package.json file:
   ```json
   {
     "name": "pdf-dependencies",
     "version": "1.0.0",
     "description": "Lambda layer for PDF generation",
     "dependencies": {
       "pdfkit": "^0.13.0",
       "aws-sdk": "^2.1048.0"
     }
   }
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a ZIP file:
   - For Linux/Mac: `cd .. && zip -r layer.zip nodejs`
   - For Windows: Use a tool like 7-Zip to create a ZIP file containing the nodejs folder

## Uploading to AWS Lambda

1. Go to the AWS Lambda console
2. Click on "Layers" in the left navigation
3. Click "Create layer"
4. Enter the following details:
   - Name: `pdf-dependencies`
   - Description: `Dependencies for PDF generation`
   - Upload the `layer.zip` file
   - Compatible runtimes: Select `Node.js 14.x`
5. Click "Create"

## Adding the Layer to Your Lambda Function

1. Go to your Lambda function
2. Scroll down to the "Layers" section
3. Click "Add a layer"
4. Select "Custom layers"
5. Select the `pdf-dependencies` layer
6. Select the version
7. Click "Add"

Your Lambda function now has access to the pdfkit and aws-sdk libraries.