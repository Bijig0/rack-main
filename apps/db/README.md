# Database

PostgreSQL database for Barry application.

## Structure

```
apps/db/
├── Dockerfile           # PostgreSQL Docker image
├── init/               # Database initialization scripts (run automatically)
│   └── 01_create_schema.sql
├── migrations/         # Migration scripts
│   └── load_traffic_data.ts
└── README.md
```

## Schema

### traffic_signal_volumes

Stores traffic volume data from SCATS (Sydney Coordinated Adaptive Traffic System) detectors.

**Columns:**
- `scats_site` - SCATS site identification number
- `interval_date` - Date of the measurement
- `detector_number` - Detector number at the SCATS site
- `v00` to `v95` - Traffic volume for each 15-minute interval (96 intervals = 24 hours)
- `region` - Geographic region
- `volume_24hour` - Total traffic volume for the entire day
- `alarm_24hour` - Number of alarms for the day

**Indexes:**
- `scats_site` - For querying specific sites
- `interval_date` - For querying by date
- `region` - For regional queries
- `(scats_site, interval_date)` - Composite index for site+date queries

**Views:**
- `peak_hour_volumes` - Pre-calculated morning (7-9 AM) and evening (5-7 PM) peak volumes

## Running the Database

### Using Docker Compose

```bash
# Start all services including the database
docker-compose up -d

# View database logs
docker-compose logs -f db

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### Connecting to the Database

**Connection Details:**
- Host: `localhost` (or `db` from within Docker network)
- Port: `5432`
- Database: `barry_db`
- User: `barry_user`
- Password: `barry_password`

**Using psql:**

```bash
# From your host machine
psql -h localhost -p 5432 -U barry_user -d barry_db

# From within Docker
docker-compose exec db psql -U barry_user -d barry_db
```

## Migrations

### Loading Traffic Signal Data

The `load_traffic_data.ts` script loads CSV files from the traffic signal volume data directory into the database.

```bash
# Run the migration script
cd apps/db/migrations
bun run load_traffic_data.ts
```

## Environment Variables

The following environment variables are used:

- `POSTGRES_HOST` - Database host (default: `localhost` or `db` in Docker)
- `POSTGRES_PORT` - Database port (default: `5432`)
- `POSTGRES_DB` - Database name (default: `barry_db`)
- `POSTGRES_USER` - Database user (default: `barry_user`)
- `POSTGRES_PASSWORD` - Database password (default: `barry_password`)

## Development

### Resetting the Database

```bash
# Stop the database and remove its volume
docker-compose stop db
docker-compose rm -v db

# Start the database again (will reinitialize)
docker-compose up -d db
```

### Viewing Schema

```sql
-- List all tables
\dt

-- Describe a table
\d traffic_signal_volumes

-- View all views
\dv

-- Describe a view
\d peak_hour_volumes
```

## Queries

### Example Queries

```sql
-- Get total traffic for a specific site and date
SELECT scats_site, interval_date, volume_24hour
FROM traffic_signal_volumes
WHERE scats_site = 100
  AND interval_date = '2025-11-04';

-- Get peak hour volumes for all sites
SELECT *
FROM peak_hour_volumes
WHERE interval_date = '2025-11-04'
ORDER BY morning_peak_volume DESC;

-- Get hourly aggregates for a site
SELECT
    scats_site,
    interval_date,
    (v00 + v01 + v02 + v03) as hour_00,
    (v04 + v05 + v06 + v07) as hour_01,
    -- ... continue for other hours
FROM traffic_signal_volumes
WHERE scats_site = 100;
```
