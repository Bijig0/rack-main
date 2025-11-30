# Deploying PostgreSQL to Railway

This guide explains how to deploy your custom PostgreSQL service to Railway.

## Prerequisites
- Railway account with your project set up
- Git repository connected to Railway

## Step 1: Deploy PostgreSQL Service

1. **Go to your Railway project dashboard**
2. Click **"New Service"**
3. Select **"GitHub Repo"** (or your connected repo)
4. Railway will detect `railway.pgdb.toml` automatically
5. Name the service: `postgres` or `database`

## Step 2: Add Persistent Volume (CRITICAL!)

**Without this step, your database will lose all data on every deployment!**

1. Click on your PostgreSQL service
2. Go to **"Settings"** tab
3. Scroll to **"Volumes"** section
4. Click **"+ New Volume"**
5. Configure:
   - **Mount Path:** `/var/lib/postgresql/data`
   - **Name:** `postgres-data` (or any name you prefer)
6. Click **"Add"**

## Step 3: Configure Environment Variables

Railway needs these environment variables for PostgreSQL:

1. Go to **"Variables"** tab
2. Add the following:

```
POSTGRES_DB=barry_db
POSTGRES_USER=barry_user
POSTGRES_PASSWORD=<generate-strong-password>
```

**Important:** Railway will also auto-generate:
- `DATABASE_URL` - Full connection string (this is what your API will use)

## Step 4: Deploy

1. Railway will automatically deploy after adding the volume and variables
2. Check **"Deployments"** tab to monitor progress
3. Wait for deployment to complete (~2-5 minutes)

## Step 5: Verify PostgreSQL is Running

1. Go to **"Logs"** tab
2. Look for:
   ```
   PostgreSQL 16.4 ... starting
   database system is ready to accept connections
   ```

3. Check that PostGIS is enabled:
   ```
   CREATE EXTENSION IF NOT EXISTS postgis
   SELECT PostGIS_Version()
   ```

## Step 6: Get Database Connection Details

Railway provides these connection variables automatically:

```
DATABASE_URL=postgresql://barry_user:PASSWORD@HOST:PORT/barry_db
PGHOST=<internal-hostname>.railway.internal
PGPORT=5432
PGUSER=barry_user
PGPASSWORD=<your-password>
PGDATABASE=barry_db
```

## Step 7: Connect API Service to PostgreSQL

1. Go to your **API service**
2. Go to **"Variables"** tab
3. Add reference to PostgreSQL service:
   - Click **"+ New Variable"** → **"Add Reference"**
   - Select your PostgreSQL service
   - Choose `DATABASE_URL`

Alternatively, manually add:
```
POSTGRES_HOST=${{postgres.PGHOST}}
POSTGRES_PORT=${{postgres.PGPORT}}
POSTGRES_USER=${{postgres.PGUSER}}
POSTGRES_PASSWORD=${{postgres.PGPASSWORD}}
POSTGRES_DB=${{postgres.PGDATABASE}}
```

## Step 8: Load Initial Data

You have two options:

### Option A: Use Railway Run Command

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link to project
railway login
railway link

# Load traffic data
railway run --service postgres bun apps/db/migrations/load_traffic_data.ts

# Load sewerage data
railway run --service postgres bun apps/db/migrations/load_sewerage_data.ts
```

### Option B: Connect Directly

```bash
# Get DATABASE_URL from Railway dashboard
export DATABASE_URL="postgresql://barry_user:PASSWORD@HOST:PORT/barry_db"

# Run data loading scripts locally
DATABASE_URL=$DATABASE_URL bun apps/db/migrations/load_traffic_data.ts
DATABASE_URL=$DATABASE_URL bun apps/db/migrations/load_sewerage_data.ts
```

## Step 9: Verify Data Loaded

Connect to Railway PostgreSQL:

```bash
# Using Railway CLI
railway connect postgres

# Or using psql directly
psql $DATABASE_URL

# Check tables
\dt

# Check row counts
SELECT 'traffic', COUNT(*) FROM traffic_signal_volumes
UNION ALL
SELECT 'sewerage', COUNT(*) FROM sewerage_pipelines;
```

## Important Notes

### Backups
Railway does NOT automatically backup custom services. Set up periodic backups:

```bash
# Backup script (run daily via cron or GitHub Actions)
pg_dump $DATABASE_URL -f backups/barry_db_$(date +%Y%m%d).sql
```

### Private Networking
Your API service will connect via Railway's private network:
- Hostname: `<service-name>.railway.internal`
- Port: `5432`
- Latency: <1ms

### Monitoring
Monitor your database:
- Railway Dashboard → Postgres Service → "Metrics"
- Watch CPU, Memory, Disk usage

### Scaling
If you need more resources:
- Railway Dashboard → Postgres Service → "Settings" → "Resources"
- Increase CPU/Memory as needed

## Troubleshooting

### Database loses data on redeploy
- ✅ Make sure persistent volume is mounted to `/var/lib/postgresql/data`

### Connection refused
- ✅ Check PostgreSQL service logs
- ✅ Verify environment variables are set correctly
- ✅ Ensure API service references PostgreSQL service variables

### PostGIS not enabled
- ✅ Init scripts should enable it automatically
- ✅ Manually enable: `CREATE EXTENSION IF NOT EXISTS postgis;`

### Slow queries
- ✅ Check if indexes are created (see init scripts)
- ✅ Run `EXPLAIN ANALYZE` on slow queries
- ✅ Consider increasing PostgreSQL service resources

## Cost Estimation

Railway charges based on usage:
- **Compute:** ~$0.000463/GB-hour
- **Estimated:** ~$5-10/month for light usage

Compare to Railway Managed PostgreSQL: ~$10-20/month

You save $5-10/month but handle backups/maintenance yourself.
