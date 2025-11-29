# Railway Deployment Guide

## Overview

This Builder.io React test application is deployed independently from the main API application. It has its own Dockerfile and does NOT require the complex environment variables from the main app.

## Important Notes

⚠️ **This is a standalone application** - It does NOT depend on the parent app's report-generator code or Google Maps APIs.

The Dockerfile is configured to:
- Build only the `builder-io-react-test` directory
- Bundle its own dependencies
- NOT include the parent app's `shared/config.ts` or environment requirements

## Health Check Configuration

The Railway deployment is configured with a health check at `/health` endpoint:
- **Path**: `/health`
- **Timeout**: 60 seconds
- **Response**: `{ "status": "ok", "timestamp": "..." }`

## Required Environment Variables

Set these in your Railway project settings (Project → Variables):

### Optional Variables

The app uses a proxied API endpoint, so no API keys are needed:

```
VITE_PUBLIC_BUILDER_KEY=<your-builder-io-key>  # Optional, for Builder.io integration
PING_MESSAGE=<custom-ping-message>             # Optional, defaults to "ping"
```

### Railway-specific Variables

Railway automatically provides:
- `PORT` - The port the application should listen on (set by Railway)

## Deployment Steps

### 1. Ensure Railway Configuration

The repository includes these files for Railway:
- `apps/api/src/builder-io-react-test/Dockerfile` - Multi-stage build configuration
- `railway.toml` - Deployment configuration pointing to the Dockerfile
- `.dockerignore` - Excludes unnecessary files from build

### 2. Deploy to Railway

Option A: **Automatic Deployment** (Recommended)
1. Connect your GitHub repository to Railway
2. Railway will automatically detect changes and deploy
3. Monitor the build logs in Railway dashboard

Option B: **Manual Deployment**
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

### 3. Verify Deployment

Once deployed, Railway will:
1. Build the Docker image (takes ~2-3 minutes)
2. Start the container
3. Run health checks at `/health` endpoint
4. Mark deployment as successful when health checks pass

You can verify the deployment:
```bash
curl https://your-app.railway.app/health
# Expected: {"status":"ok","timestamp":"2025-11-29T..."}
```

## Troubleshooting

### Health Check Failing

If you see "replicas never became healthy":

1. **Check build logs** - Look for build errors in Railway dashboard
2. **Verify Dockerfile path** - Ensure `railway.toml` points to correct Dockerfile
3. **Check server startup** - View application logs for Node.js errors
4. **Verify port binding** - App should listen on `process.env.PORT`

### Build Failures

Common build issues:

**1. Wrong Dockerfile Path**
```toml
# railway.toml should have:
dockerfilePath = "apps/api/src/builder-io-react-test/Dockerfile"
```

**2. Missing Dependencies**
- Ensure all dependencies are in `package.json`
- Check that build scripts work locally: `npm run build`

**3. Import Errors**
- The app should NOT import from parent directories (`../../../shared/`, etc.)
- If you see environment variable errors, check for imports from parent app code

### Application Crashes on Startup

If the app crashes immediately:

**Error: `Cannot find module`**
- Check that all imports are relative to the builder-io-react-test directory
- Verify `dist/` directory contains both `spa/` and `server/` folders

**Error: `ZodError: Invalid input`**
- This means the app is importing code from the parent app that requires environment variables
- Check for imports from `../../../shared/` or `../../../report-generator/`
- Comment out or remove those imports

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
