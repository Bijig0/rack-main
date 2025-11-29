# Quick Start Guide

This guide will help you get the PostgreSQL database up and running and load the traffic signal volume data.

## Prerequisites

- Docker and Docker Compose installed
- Bun runtime installed

## Step 1: Start the Database

From the project root directory:

```bash
# Start all services (API, Redis, and PostgreSQL)
docker-compose up -d

# Or start just the database
docker-compose up -d db

# Check that the database is running
docker-compose ps
```

The database will automatically:
- Create the `barry_db` database
- Run the initialization script (`apps/db/init/01_create_schema.sql`)
- Create the `traffic_signal_volumes` table with indexes
- Create the `peak_hour_volumes` view

## Step 2: Verify Database Connection

```bash
# Connect to the database using psql
docker-compose exec db psql -U barry_user -d barry_db

# Or from your host (if psql is installed)
psql -h localhost -p 5432 -U barry_user -d barry_db
# Password: barry_password
```

Once connected, verify the schema:

```sql
-- List tables
\dt

-- Describe the traffic_signal_volumes table
\d traffic_signal_volumes

-- Check that the table is empty (before migration)
SELECT COUNT(*) FROM traffic_signal_volumes;

-- Exit psql
\q
```

## Step 3: Install Migration Dependencies

```bash
cd apps/db/migrations
bun install
```

## Step 4: Run the Migration (Load CSV Data)

### Option A: Dry Run (Recommended First)

Test the migration without inserting data:

```bash
bun run load-traffic-data:dry-run
```

This will:
- Read and parse all CSV files
- Show you how many records would be inserted
- NOT insert any data into the database

### Option B: Load All CSV Files

Load all traffic signal volume CSV files from the default directory:

```bash
bun run load-traffic-data
```

This will:
- Read all CSV files from `apps/api/src/.../traffic_signal_volume_data_november_2025/`
- Parse approximately 1.1M+ records (10 CSV files × ~116K records each)
- Insert them into the database in batches of 1000
- Skip duplicate records automatically
- Show progress updates
- Display final statistics

**Expected output:**
```
=== Traffic Signal Volume Data Migration ===

Database: localhost:5432/barry_db
Dry run: NO

Found 10 CSV file(s) to process:

  - VSDATA_20251101.csv
  - VSDATA_20251102.csv
  - ...

Reading file: .../VSDATA_20251101.csv
Parsed 116830 records from VSDATA_20251101.csv
...

Inserting 1168300 records in batches of 1000...
Progress: 1000/1168300 (0.1%) - Inserted: 1000, Skipped: 0
Progress: 2000/1168300 (0.2%) - Inserted: 2000, Skipped: 0
...

Completed! Total inserted: 1168300, Total skipped (duplicates): 0

=== Database Statistics ===
Total records: 1168300
Unique SCATS sites: 3042
Unique dates: 10
Date range: 2025-11-01 to 2025-11-10
```

### Option C: Load a Single File

Load a specific CSV file:

```bash
bun run load_traffic_data.ts --file /path/to/VSDATA_20251104.csv
```

### Option D: Load from Custom Directory

Load all CSV files from a custom directory:

```bash
bun run load_traffic_data.ts --directory /path/to/csv/files
```

## Step 5: Verify the Data

Connect to the database and run some queries:

```bash
docker-compose exec db psql -U barry_user -d barry_db
```

```sql
-- Check total record count
SELECT COUNT(*) FROM traffic_signal_volumes;

-- View sample data
SELECT * FROM traffic_signal_volumes LIMIT 5;

-- Check unique sites
SELECT COUNT(DISTINCT scats_site) FROM traffic_signal_volumes;

-- Get total traffic for a specific site and date
SELECT scats_site, interval_date, volume_24hour, region
FROM traffic_signal_volumes
WHERE scats_site = 100
  AND interval_date = '2025-11-04'
ORDER BY detector_number;

-- Use the peak hour view
SELECT
    scats_site,
    interval_date,
    morning_peak_volume,
    evening_peak_volume,
    volume_24hour
FROM peak_hour_volumes
WHERE interval_date = '2025-11-04'
ORDER BY volume_24hour DESC
LIMIT 10;
```

## Troubleshooting

### Database Won't Start

```bash
# Check logs
docker-compose logs db

# Remove and recreate the database
docker-compose down -v
docker-compose up -d db
```

### Migration Fails

```bash
# Check database connection
docker-compose exec db psql -U barry_user -d barry_db -c "SELECT 1"

# Check if table exists
docker-compose exec db psql -U barry_user -d barry_db -c "\dt"

# View migration logs for errors
# (Check the terminal output from the migration script)
```

### Connection Refused

Make sure the database is running and healthy:

```bash
docker-compose ps
docker-compose logs db
```

Wait for the healthcheck to pass:
```
db  | LOG:  database system is ready to accept connections
```

## Performance Notes

- **Migration time**: Loading ~1.1M records takes approximately 2-5 minutes depending on your machine
- **Batch size**: The migration inserts 1000 records at a time for optimal performance
- **Duplicate handling**: Records are automatically skipped if they already exist (based on unique constraint)
- **Re-running**: You can safely re-run the migration - duplicates will be skipped

## Next Steps

After loading the data, you can:

1. **Query the data** from your API application
2. **Create additional indexes** if needed for specific queries
3. **Set up database backups** for production use
4. **Create additional views** for common query patterns

## Environment Variables

The migration script uses these environment variables (with defaults):

- `POSTGRES_HOST` (default: `localhost`)
- `POSTGRES_PORT` (default: `5432`)
- `POSTGRES_DB` (default: `barry_db`)
- `POSTGRES_USER` (default: `barry_user`)
- `POSTGRES_PASSWORD` (default: `barry_password`)

You can override these by setting them before running the migration:

```bash
POSTGRES_HOST=db bun run load-traffic-data
```

Or create a `.env` file in `apps/db/migrations/`.
