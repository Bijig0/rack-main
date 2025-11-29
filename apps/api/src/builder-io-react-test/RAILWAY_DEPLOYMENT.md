# Railway Deployment Guide

## Overview

This application requires specific environment variables to be set in Railway for successful deployment.

## Health Check Configuration

The Railway deployment is configured with a health check at `/health` endpoint:
- **Path**: `/health`
- **Timeout**: 60 seconds
- **Response**: `{ "status": "ok", "timestamp": "..." }`

## Required Environment Variables

Set these in your Railway project settings (Project → Variables):

### Required API Keys

```
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
GOOGLE_STREET_VIEW_API_KEY=<your-google-street-view-api-key>
GOOGLE_GEMINI_API_KEY=<your-google-gemini-api-key>
PTV_DEV_ID=<your-ptv-developer-id>
PTV_DEV_KEY=<your-ptv-developer-key>
```

### Optional Variables (have defaults)

```
CORELOGIC_EMAIL=<email>
CORELOGIC_USERNAME=<username>
CORELOGIC_PASSWORD=<password>
CORELOGIC_URL=https://propertyhub.corelogic.asia/
FIGMA_ACCESS_TOKEN=<figma-token>  # Optional
FIGMA_PDF_DESIGN_FILE_URL=<url>  # Optional
```

### Railway-specific Variables

Railway automatically provides:
- `PORT` - The port the application should listen on (set by Railway)

## Deployment Steps

1. **Set Environment Variables**:
   - Go to your Railway project
   - Navigate to Variables tab
   - Add all required environment variables listed above

2. **Deploy**:
   - Push your code to the connected repository
   - Railway will automatically build and deploy using the Dockerfile

3. **Verify Health Check**:
   - Once deployed, Railway will check `/health` endpoint
   - The deployment is successful when all replicas become healthy

## Troubleshooting

### Health Check Failing

If you see "replicas never became healthy":

1. Check Railway logs for errors
2. Verify all required environment variables are set
3. Check that the PORT variable is not manually set (Railway provides it automatically)
4. Ensure the application is listening on `process.env.PORT`

### Missing Environment Variables

The application will fail to start if required environment variables are missing:
- Error: `ZodError: Invalid input: expected string, received undefined`
- Solution: Add the missing environment variable in Railway's Variables tab

### Build Failures

If the build fails:
1. Check Railway build logs
2. Verify the Dockerfile exists and is correct
3. Ensure all dependencies are in package.json
4. Check for syntax errors in TypeScript files

## Local Testing

To test the production build locally:

1. Set environment variables in `.env` file
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```
4. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-29T12:00:00.000Z"
}
```

## Configuration Files

- `railway.toml` - Railway deployment configuration
- `Dockerfile` - Container build instructions
- `.env` - Local environment variables (not committed to git)
- `server/index.ts` - Health endpoint implementation
- `server/node-build.ts` - Production server entry point
