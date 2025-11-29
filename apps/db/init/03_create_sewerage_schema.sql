-- Create sewerage pipelines table with PostGIS geometry
CREATE TABLE IF NOT EXISTS sewerage_pipelines (
    id SERIAL PRIMARY KEY,

    -- Pipeline identifiers
    objectid INTEGER NOT NULL,
    mxunitid VARCHAR(100) NOT NULL,
    mxsiteid VARCHAR(50),
    compkey INTEGER,
    comptype INTEGER,
    unitid VARCHAR(50),
    unitid2 VARCHAR(50),
    parallel_line_nbr VARCHAR(10),

    -- Pipeline type and description
    unittype VARCHAR(20),
    unittype_desc VARCHAR(100),
    sewer_name VARCHAR(200),
    asset_id VARCHAR(50),
    alternate_asset_id VARCHAR(50),
    subarea VARCHAR(50),

    -- Physical properties
    material VARCHAR(50),
    upstream_il DOUBLE PRECISION,
    downstream_il DOUBLE PRECISION,
    pipe_length DOUBLE PRECISION,
    pipe_width INTEGER,
    pipe_height INTEGER,
    grade DOUBLE PRECISION,

    -- Dates and construction info
    date_relined TIMESTAMP,
    date_of_construction TIMESTAMP,
    epms_sec_no VARCHAR(50),
    asconst_plan_no VARCHAR(50),
    source VARCHAR(100),
    method_of_capture VARCHAR(100),
    date_captured TIMESTAMP,
    date_last_updated TIMESTAMP,

    -- Service status
    service_status VARCHAR(20),
    service_status_chg_date TIMESTAMP,
    service_status_plan_no VARCHAR(50),
    comments TEXT,
    mi_prinx INTEGER,

    -- PostGIS geometry column (SRID 4326 = WGS84 lat/lon)
    geom GEOMETRY(GEOMETRY, 4326),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint
    CONSTRAINT unique_sewerage_pipeline UNIQUE (objectid)
);

-- Create spatial index on geometry column for fast spatial queries
CREATE INDEX idx_sewerage_pipelines_geom ON sewerage_pipelines USING GIST (geom);

-- Create regular indexes for common queries
CREATE INDEX idx_sewerage_pipelines_service_status ON sewerage_pipelines(service_status);
CREATE INDEX idx_sewerage_pipelines_unittype ON sewerage_pipelines(unittype);
CREATE INDEX idx_sewerage_pipelines_sewer_name ON sewerage_pipelines(sewer_name);
CREATE INDEX idx_sewerage_pipelines_mxunitid ON sewerage_pipelines(mxunitid);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sewerage_pipelines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sewerage_pipelines_updated_at_trigger
    BEFORE UPDATE ON sewerage_pipelines
    FOR EACH ROW
    EXECUTE FUNCTION update_sewerage_pipelines_updated_at();

COMMENT ON TABLE sewerage_pipelines IS 'Sewerage network main pipelines with PostGIS geometry for spatial queries';
COMMENT ON COLUMN sewerage_pipelines.geom IS 'Pipeline geometry (LineString or MultiLineString) in WGS84 (SRID 4326)';
COMMENT ON COLUMN sewerage_pipelines.service_status IS 'Service status: IN = active, other values indicate inactive/decommissioned';
