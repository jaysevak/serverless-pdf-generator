# Fixing the Lambda Function Error

The error you're seeing is because your Lambda function is being treated as an ES module (indicated by the `.mjs` extension) but you're using CommonJS `require()` statements. Here are two ways to fix this:

## Option 1: Change the file extension to .js (Recommended)

1. In the AWS Lambda console, go to your function
2. Click on the "Code" tab
3. Rename the file from `index.mjs` to `index.js`
4. Click "Deploy"

This will make Lambda treat your file as a CommonJS module, which is compatible with the `require()` statements.

## Option 2: Use ES modules syntax

If you want to keep using ES modules, you need to update your code to use ES module imports:

1. In the AWS Lambda console, go to your function
2. Replace the current code with the content of the `index-esm.js` file I've provided
3. Update your package.json to include `"type": "module"` and update the AWS SDK dependency
4. Click "Deploy"

## Option 3: Create a new deployment package

If you're having trouble editing the code directly in the console:

1. Create a deployment package:
   ```
   zip -r function.zip index.js package.json node_modules
   ```

2. Upload the deployment package:
   - In the Lambda console, click "Upload from"
   - Select ".zip file"
   - Upload your function.zip file
   - Click "Save"

## Testing the function

After making these changes, test your function again using the same test event. The error should be resolved.

## Common issues and solutions

1. **Module not found errors**: Make sure your dependencies are properly installed in the node_modules directory.

2. **Permission issues**: Ensure your Lambda function has the necessary IAM permissions to publish to SNS.

3. **Layer compatibility**: If you're using Lambda Layers, make sure they're compatible with your function's runtime.

4. **Runtime version**: Ensure you're using Node.js 14.x or later for ES modules support.