#!/bin/bash

# Install dependencies
npm install

# Deploy to AWS using Serverless Framework
serverless deploy --config serverless-combined.yml