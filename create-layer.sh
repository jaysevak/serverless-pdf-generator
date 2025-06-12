#!/bin/bash

# Create a temporary directory for the layer
mkdir -p lambda-layer/nodejs

# Navigate to the layer directory
cd lambda-layer/nodejs

# Initialize package.json
echo '{
  "name": "pdf-dependencies",
  "version": "1.0.0",
  "description": "Lambda layer for PDF generation",
  "dependencies": {
    "pdfkit": "^0.13.0",
    "aws-sdk": "^2.1048.0"
  }
}' > package.json

# Install dependencies
npm install

# Go back to the parent directory
cd ..

# Create the ZIP file
zip -r layer.zip nodejs

echo "Layer ZIP file created: layer.zip"
echo "Upload this file when creating your Lambda layer"

# Clean up
# Uncomment if you want to remove the directory after creating the ZIP
# cd ..
# rm -rf lambda-layer