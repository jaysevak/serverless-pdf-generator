# Setting Up API Gateway Using AWS CLI

If you prefer using the AWS CLI instead of the console, follow these steps to create your API Gateway resources and methods.

## Prerequisites

1. Install the AWS CLI:
   ```
   pip install awscli
   ```

2. Configure your AWS credentials:
   ```
   aws configure
   ```

## Step 1: Create the API

```bash
# Create a new REST API
aws apigateway create-rest-api --name "FormProcessingAPI" --region us-east-1

# Store the API ID for later use
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='FormProcessingAPI'].id" --output text --region us-east-1)

# Get the root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text --region us-east-1)

echo "API ID: $API_ID"
echo "Root Resource ID: $ROOT_RESOURCE_ID"
```

## Step 2: Create Resources

```bash
# Create the process-form resource
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE_ID \
  --path-part "process-form" \
  --region us-east-1

# Store the process-form resource ID
PROCESS_FORM_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/process-form'].id" --output text --region us-east-1)

# Create the generate-pdf resource
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE_ID \
  --path-part "generate-pdf" \
  --region us-east-1

# Store the generate-pdf resource ID
GENERATE_PDF_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/generate-pdf'].id" --output text --region us-east-1)

echo "Process Form Resource ID: $PROCESS_FORM_RESOURCE_ID"
echo "Generate PDF Resource ID: $GENERATE_PDF_RESOURCE_ID"
```

## Step 3: Create Methods

First, get your Lambda function ARN:

```bash
# Get the Lambda function ARN
LAMBDA_ARN=$(aws lambda get-function --function-name formHandler --query "Configuration.FunctionArn" --output text --region us-east-1)

echo "Lambda ARN: $LAMBDA_ARN"
```

Then create the methods:

```bash
# Create POST method for process-form
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE \
  --region us-east-1

# Create POST method for generate-pdf
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE \
  --region us-east-1
```

## Step 4: Set Up Lambda Integration

```bash
# Set up Lambda integration for process-form
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
  --region us-east-1

# Set up Lambda integration for generate-pdf
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
  --region us-east-1
```

## Step 5: Set Up Method Responses

```bash
# Set up method response for process-form
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-models '{"application/json": "Empty"}' \
  --region us-east-1

# Set up method response for generate-pdf
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-models '{"application/json": "Empty"}' \
  --region us-east-1
```

## Step 6: Set Up Integration Responses

```bash
# Set up integration response for process-form
aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --selection-pattern "" \
  --region us-east-1

# Set up integration response for generate-pdf
aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --selection-pattern "" \
  --region us-east-1
```

## Step 7: Enable CORS

```bash
# Enable CORS for process-form
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Origin": true}' \
  --region us-east-1

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $PROCESS_FORM_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'\'*\'\'"}' \
  --region us-east-1

# Enable CORS for generate-pdf
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Origin": true}' \
  --region us-east-1

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $GENERATE_PDF_RESOURCE_ID \
  --http-method POST \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'\'*\'\'"}' \
  --region us-east-1
```

## Step 8: Deploy the API

```bash
# Create a deployment
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name dev \
  --region us-east-1

# Get the invoke URL
INVOKE_URL="https://${API_ID}.execute-api.us-east-1.amazonaws.com/dev"
echo "API Invoke URL: $INVOKE_URL"
```

## Step 9: Grant Lambda Permission

```bash
# Grant permission for API Gateway to invoke the Lambda function
aws lambda add-permission \
  --function-name formHandler \
  --statement-id apigateway-process-form \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query 'Account' --output text):${API_ID}/*/POST/process-form" \
  --region us-east-1

aws lambda add-permission \
  --function-name formHandler \
  --statement-id apigateway-generate-pdf \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-east-1:$(aws sts get-caller-identity --query 'Account' --output text):${API_ID}/*/POST/generate-pdf" \
  --region us-east-1
```

## Testing Your API

```bash
# Test the process-form endpoint
curl -X POST \
  "${INVOKE_URL}/process-form" \
  -H "Content-Type: application/json" \
  -d @test-form.json

# Test the generate-pdf endpoint
curl -X POST \
  "${INVOKE_URL}/generate-pdf" \
  -H "Content-Type: application/json" \
  -d @test-pdf.json
```