# Railway Deployment Guide

This guide explains how to deploy the Barry application to Railway.

## Architecture

The application is split into **2 services** on Railway:

1. **API Service** - Main backend API (Bun + Hono)
2. **PDF Service** - Builder.io React PDF generator

**Databases are managed by Railway:**
- PostgreSQL (Railway-managed)
- Redis (Railway-managed)

## Deployment Steps

### 1. Create a New Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose the `barry` repository

### 2. Set Up Services

#### Service 1: API

1. Create a new service in Railway dashboard
2. **Settings:**
   - Name: `api`
   - Root Directory: Leave blank (uses repo root)
   - Build Configuration: `railway.api.toml`
3. **Environment Variables:**
   ```
   GOOGLE_MAPS_API_KEY=<your-key>
   GOOGLE_STREET_VIEW_API_KEY=<your-key>
   GOOGLE_GEMINI_API_KEY=<your-key>
   PTV_DEV_ID=<your-id>
   PTV_DEV_KEY=<your-key>
   FIGMA_ACCESS_TOKEN=<your-token>
   FIGMA_PDF_DESIGN_FILE_URL=<your-url>
   CORELOGIC_EMAIL=<your-email>
   CORELOGIC_USERNAME=<your-username>
   CORELOGIC_PASSWORD=<your-password>
   CORELOGIC_URL=https://propertyhub.corelogic.asia/
   BUILDER_IO_PRIVATE_KEY=<your-key>
   BUILDER_IO_PUBLIC_KEY=<your-key>
   BUILDER_IO_RACK_PROJECT_ID=<your-id>
   ```

   **Note:** `DATABASE_URL` and `REDIS_URL` are auto-injected by Railway plugins

#### Service 2: PDF

1. Create another service in Railway dashboard
2. **Settings:**
   - Name: `pdf`
   - Root Directory: Leave blank
   - Build Configuration: `railway.pdf.toml`
3. **Environment Variables:** None needed (static site)

### 3. Add Database Services

#### PostgreSQL

1. In Railway dashboard, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will:
   - Create a PostgreSQL instance
   - Auto-inject `DATABASE_URL` into all services
4. **Run migrations:**
   - In the PostgreSQL service dashboard, go to "Data" tab
   - Connect to the database
   - Run your SQL migration scripts from `apps/db/migrations/`

#### Redis

1. In Railway dashboard, click "+ New"
2. Select "Database" → "Add Redis"
3. Railway will auto-inject `REDIS_URL` into all services

### 4. Configure Service References

The API service needs to know the PDF service URL:

1. Go to API service settings
2. Add environment variable:
   ```
   PDF_SERVICE_URL=${{pdf.RAILWAY_PUBLIC_DOMAIN}}
   ```

### 5. Deploy

1. Railway will auto-deploy on every push to `main`
2. Monitor deployment in the Railway dashboard
3. Check logs for any errors

## Configuration Files

### `railway.api.toml`
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/Dockerfile"

[deploy]
startCommand = "bun run src/server/server.ts"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### `railway.pdf.toml`
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "apps/api/src/builder-io-react-test/Dockerfile"

[deploy]
startCommand = "serve -s spa -l 8000"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## Environment Variable Summary

### Auto-Injected by Railway
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `PORT` - Service port (Railway assigns dynamically)

### You Must Configure
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_STREET_VIEW_API_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `PTV_DEV_ID`
- `PTV_DEV_KEY`
- `FIGMA_ACCESS_TOKEN`
- `FIGMA_PDF_DESIGN_FILE_URL`
- `CORELOGIC_EMAIL`
- `CORELOGIC_USERNAME`
- `CORELOGIC_PASSWORD`
- `CORELOGIC_URL`
- `BUILDER_IO_PRIVATE_KEY`
- `BUILDER_IO_PUBLIC_KEY`
- `BUILDER_IO_RACK_PROJECT_ID`

## Code Changes for Railway

The codebase has been updated to support both local development and Railway:

### Database Connection (`apps/api/src/db/pool.ts`)
- Uses `DATABASE_URL` if available (Railway)
- Falls back to individual env vars (local Docker)

### Redis Connection (`apps/api/src/server/server.ts` & `worker.ts`)
- Parses `REDIS_URL` if available (Railway)
- Falls back to `REDIS_HOST` (local Docker)

### Cache Store (`RedisCacheStore.ts`)
- Already supports `REDIS_URL`

## Local Development

Local development continues to work with Docker Compose:

```bash
docker-compose up
```

The code automatically detects the environment and uses the appropriate connection method.

## Monitoring

### Logs
- View logs in Railway dashboard under each service
- Memory usage is logged via the profiling code

### Health Check
- API health endpoint: `https://your-api.railway.app/health`

## Troubleshooting

### Memory Issues
- Railway default: 512MB (Starter), 8GB (Pro)
- If getting OOM kills, upgrade plan or increase memory limit
- Monitor memory usage via profiling logs

### Database Connection Issues
- Ensure PostgreSQL plugin is added
- Check that `DATABASE_URL` is injected
- Verify SSL is enabled (required for Railway Postgres)

### Redis Connection Issues
- Ensure Redis plugin is added
- Check that `REDIS_URL` is injected
- Verify connection parsing in logs

## Cost Optimization

1. **Use Railway-managed databases** (included in plan)
2. **Start with Starter plan** (~$5/mo per service)
3. **Monitor usage** in Railway dashboard
4. **Scale up only if needed** (memory, CPU)

## Migration from Docker Compose

Railway deployment replaces:
- ❌ `docker-compose.yml` db service → ✅ Railway PostgreSQL
- ❌ `docker-compose.yml` redis service → ✅ Railway Redis
- ✅ `docker-compose.yml` api service → ✅ Railway API service
- ✅ `docker-compose.yml` pdf service → ✅ Railway PDF service

`docker-compose.yml` is kept for **local development only**.
