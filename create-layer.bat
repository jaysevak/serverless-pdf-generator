@echo off
echo Creating Lambda layer for PDF dependencies...

REM Create a temporary directory for the layer
mkdir lambda-layer\nodejs

REM Navigate to the layer directory
cd lambda-layer\nodejs

REM Create package.json
echo {^
  "name": "pdf-dependencies",^
  "version": "1.0.0",^
  "description": "Lambda layer for PDF generation",^
  "dependencies": {^
    "pdfkit": "^0.13.0",^
    "aws-sdk": "^2.1048.0"^
  }^
} > package.json

REM Install dependencies
call npm install

REM Go back to the parent directory
cd ..

REM Check if 7-Zip is available
where 7z >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    REM Create ZIP using 7-Zip
    7z a -r layer.zip nodejs
) else (
    echo 7-Zip not found. Please install 7-Zip or manually zip the nodejs folder.
    echo You can download 7-Zip from: https://www.7-zip.org/
)

echo.
echo If the ZIP was created successfully, upload layer.zip when creating your Lambda layer.
echo.

REM Return to the original directory
cd ..