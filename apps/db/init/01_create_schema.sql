-- Create database schema for traffic signal volume data
-- This table stores traffic volume data from SCATS (Sydney Coordinated Adaptive Traffic System)

CREATE TABLE IF NOT EXISTS traffic_signal_volumes (
    id SERIAL PRIMARY KEY,
    scats_site INTEGER NOT NULL,
    interval_date DATE NOT NULL,
    detector_number INTEGER NOT NULL,

    -- 96 columns for 15-minute intervals (24 hours * 4 intervals per hour)
    -- Each column represents a 15-minute interval starting from 00:00
    v00 INTEGER, v01 INTEGER, v02 INTEGER, v03 INTEGER, v04 INTEGER,
    v05 INTEGER, v06 INTEGER, v07 INTEGER, v08 INTEGER, v09 INTEGER,
    v10 INTEGER, v11 INTEGER, v12 INTEGER, v13 INTEGER, v14 INTEGER,
    v15 INTEGER, v16 INTEGER, v17 INTEGER, v18 INTEGER, v19 INTEGER,
    v20 INTEGER, v21 INTEGER, v22 INTEGER, v23 INTEGER, v24 INTEGER,
    v25 INTEGER, v26 INTEGER, v27 INTEGER, v28 INTEGER, v29 INTEGER,
    v30 INTEGER, v31 INTEGER, v32 INTEGER, v33 INTEGER, v34 INTEGER,
    v35 INTEGER, v36 INTEGER, v37 INTEGER, v38 INTEGER, v39 INTEGER,
    v40 INTEGER, v41 INTEGER, v42 INTEGER, v43 INTEGER, v44 INTEGER,
    v45 INTEGER, v46 INTEGER, v47 INTEGER, v48 INTEGER, v49 INTEGER,
    v50 INTEGER, v51 INTEGER, v52 INTEGER, v53 INTEGER, v54 INTEGER,
    v55 INTEGER, v56 INTEGER, v57 INTEGER, v58 INTEGER, v59 INTEGER,
    v60 INTEGER, v61 INTEGER, v62 INTEGER, v63 INTEGER, v64 INTEGER,
    v65 INTEGER, v66 INTEGER, v67 INTEGER, v68 INTEGER, v69 INTEGER,
    v70 INTEGER, v71 INTEGER, v72 INTEGER, v73 INTEGER, v74 INTEGER,
    v75 INTEGER, v76 INTEGER, v77 INTEGER, v78 INTEGER, v79 INTEGER,
    v80 INTEGER, v81 INTEGER, v82 INTEGER, v83 INTEGER, v84 INTEGER,
    v85 INTEGER, v86 INTEGER, v87 INTEGER, v88 INTEGER, v89 INTEGER,
    v90 INTEGER, v91 INTEGER, v92 INTEGER, v93 INTEGER, v94 INTEGER,
    v95 INTEGER,

    -- Metadata columns
    region VARCHAR(50),
    record_count INTEGER,
    volume_24hour INTEGER,
    alarm_24hour INTEGER,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint to prevent duplicate entries
    CONSTRAINT unique_traffic_reading UNIQUE (scats_site, interval_date, detector_number)
);

-- Create indexes for common queries
CREATE INDEX idx_scats_site ON traffic_signal_volumes(scats_site);
CREATE INDEX idx_interval_date ON traffic_signal_volumes(interval_date);
CREATE INDEX idx_region ON traffic_signal_volumes(region);
CREATE INDEX idx_scats_site_date ON traffic_signal_volumes(scats_site, interval_date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_traffic_signal_volumes_updated_at
    BEFORE UPDATE ON traffic_signal_volumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easier querying of peak hour data
CREATE OR REPLACE VIEW peak_hour_volumes AS
SELECT
    scats_site,
    interval_date,
    detector_number,
    region,
    -- Morning peak (7:00 AM - 9:00 AM): intervals 28-35
    (v28 + v29 + v30 + v31 + v32 + v33 + v34 + v35) as morning_peak_volume,
    -- Evening peak (5:00 PM - 7:00 PM): intervals 68-75
    (v68 + v69 + v70 + v71 + v72 + v73 + v74 + v75) as evening_peak_volume,
    volume_24hour
FROM traffic_signal_volumes;

COMMENT ON TABLE traffic_signal_volumes IS 'Traffic volume data from SCATS (traffic signal) detectors, with 15-minute intervals throughout the day';
COMMENT ON COLUMN traffic_signal_volumes.scats_site IS 'SCATS site identification number';
COMMENT ON COLUMN traffic_signal_volumes.detector_number IS 'Detector number at the SCATS site';
COMMENT ON COLUMN traffic_signal_volumes.v00 IS 'Traffic volume for interval 0 (00:00-00:15)';
COMMENT ON COLUMN traffic_signal_volumes.volume_24hour IS 'Total traffic volume for the entire 24-hour period';
