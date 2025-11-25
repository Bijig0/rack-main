#!/bin/bash

# Yarra Valley Water Infrastructure Data Fetcher
# Bash script with working curl examples

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}   YVW Infrastructure Data Fetcher${NC}"
echo -e "${BLUE}=================================================${NC}\n"

# Configuration
BASE_URL="https://webmap.yvw.com.au/YVWAssets/service.svc/get"

# Example coordinates (Melbourne CBD)
# Replace with your property coordinates
LAT=-37.8136
LON=144.9631
BUFFER=0.005  # ~500 meters

# Calculate bounding box
MIN_LON=$(echo "$LON - $BUFFER" | bc)
MIN_LAT=$(echo "$LAT - $BUFFER" | bc)
MAX_LON=$(echo "$LON + $BUFFER" | bc)
MAX_LAT=$(echo "$LAT + $BUFFER" | bc)
BBOX="${MIN_LON},${MIN_LAT},${MAX_LON},${MAX_LAT},EPSG:4326"

echo -e "${YELLOW}Property Location:${NC}"
echo "  Latitude:  $LAT"
echo "  Longitude: $LON"
echo "  Bounding Box: $BBOX"
echo ""

# Create output directory
OUTPUT_DIR="yvw_data_output"
mkdir -p "$OUTPUT_DIR"

# Function to fetch data
fetch_data() {
    local typename=$1
    local output_file=$2
    local description=$3
    
    echo -e "${GREEN}Fetching ${description}...${NC}"
    
    curl -s -G "$BASE_URL" \
        --data-urlencode "SERVICE=WFS" \
        --data-urlencode "VERSION=2.0.0" \
        --data-urlencode "REQUEST=GetFeature" \
        --data-urlencode "TYPENAME=$typename" \
        --data-urlencode "OUTPUTFORMAT=application/json" \
        --data-urlencode "SRSNAME=EPSG:4326" \
        --data-urlencode "BBOX=$BBOX" \
        --data-urlencode "COUNT=100" \
        -o "$OUTPUT_DIR/$output_file"
    
    if [ $? -eq 0 ]; then
        # Count features
        local count=$(grep -o '"features"' "$OUTPUT_DIR/$output_file" | wc -l)
        if [ -f "$OUTPUT_DIR/$output_file" ] && [ -s "$OUTPUT_DIR/$output_file" ]; then
            echo -e "  ${GREEN}✓${NC} Saved to $output_file"
        else
            echo -e "  ${RED}✗${NC} No data or error"
        fi
    else
        echo -e "  ${RED}✗${NC} Failed to fetch"
    fi
}

echo -e "${BLUE}=== WATER INFRASTRUCTURE ===${NC}\n"

fetch_data "yvw:WATERPIPES" \
    "water_pipes.json" \
    "Water Pipes"

fetch_data "yvw:WATERPROPERTYCONNECTIONS" \
    "water_connections.json" \
    "Water Property Connections"

fetch_data "yvw:WATERHYDRANTS" \
    "water_hydrants.json" \
    "Water Hydrants"

fetch_data "yvw:WATERVALVES" \
    "water_valves.json" \
    "Water Valves"

echo ""
echo -e "${BLUE}=== SEWER INFRASTRUCTURE ===${NC}\n"

fetch_data "yvw:SEWERPIPES" \
    "sewer_pipes.json" \
    "Sewer Pipes"

fetch_data "yvw:SEWERBRANCHES" \
    "sewer_branches.json" \
    "Sewer Property Branches"

fetch_data "yvw:SEWERSTRUCTURES" \
    "sewer_structures.json" \
    "Sewer Structures (Pump Stations)"

fetch_data "yvw:SEWERACCESSPOINTS" \
    "sewer_access.json" \
    "Sewer Access Points (Manholes)"

echo ""
echo -e "${BLUE}=== RECYCLED WATER (NDW) ===${NC}\n"

fetch_data "yvw:NDWPIPES" \
    "ndw_pipes.json" \
    "Recycled Water Pipes"

fetch_data "yvw:NDWPROPERTYCONNECTIONS" \
    "ndw_connections.json" \
    "Recycled Water Property Connections"

fetch_data "yvw:NDW_DISTRIBUTION_ZONES" \
    "ndw_zones.json" \
    "Recycled Water Distribution Zones"

echo ""
echo -e "${BLUE}=== PLANNED INFRASTRUCTURE ===${NC}\n"

fetch_data "yvw:PLANNED_WATER_PIPES" \
    "planned_water.json" \
    "Planned Water Infrastructure"

fetch_data "yvw:PLANNED_SEWER_PIPES" \
    "planned_sewer.json" \
    "Planned Sewer Infrastructure"

echo ""
echo -e "${GREEN}=== COMPLETE ===${NC}\n"
echo "All data saved to: $OUTPUT_DIR/"
echo ""

# Analyze results
echo -e "${BLUE}=== QUICK ANALYSIS ===${NC}\n"

analyze_file() {
    local file=$1
    local name=$2
    
    if [ -f "$OUTPUT_DIR/$file" ]; then
        local features=$(grep -o '"type":"Feature"' "$OUTPUT_DIR/$file" | wc -l)
        if [ $features -gt 0 ]; then
            echo -e "  ${GREEN}✓${NC} $name: $features features found"
        else
            echo -e "  ${YELLOW}○${NC} $name: No features in area"
        fi
    fi
}

echo -e "${YELLOW}Water Infrastructure:${NC}"
analyze_file "water_pipes.json" "Water Pipes"
analyze_file "water_connections.json" "Property Connections"
analyze_file "water_hydrants.json" "Hydrants"

echo ""
echo -e "${YELLOW}Sewer Infrastructure:${NC}"
analyze_file "sewer_pipes.json" "Sewer Pipes"
analyze_file "sewer_branches.json" "Property Branches"
analyze_file "sewer_structures.json" "Structures"

echo ""
echo -e "${YELLOW}Recycled Water:${NC}"
analyze_file "ndw_pipes.json" "NDW Pipes"
analyze_file "ndw_connections.json" "Property Connections"
analyze_file "ndw_zones.json" "Distribution Zones"

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}Data collection complete!${NC}"
echo ""
echo "To view data:"
echo "  - Open JSON files in a text editor"
echo "  - Use jq for better formatting: cat $OUTPUT_DIR/water_pipes.json | jq"
echo "  - Import into QGIS or other GIS software"
echo ""

# Optional: Create a summary CSV
echo "Creating summary..."
{
    echo "Infrastructure Type,Features Found,Status"
    for file in "$OUTPUT_DIR"/*.json; do
        basename=$(basename "$file" .json)
        features=$(grep -o '"type":"Feature"' "$file" 2>/dev/null | wc -l)
        status="Available"
        [ $features -eq 0 ] && status="Not Found"
        echo "$basename,$features,$status"
    done
} > "$OUTPUT_DIR/summary.csv"

echo -e "${GREEN}✓${NC} Summary saved to: $OUTPUT_DIR/summary.csv"
echo ""

# Example: Get CSV output instead of JSON
echo -e "${BLUE}=== BONUS: CSV Export Example ===${NC}\n"
echo "Fetching water pipes as CSV..."

curl -s -G "$BASE_URL" \
    --data-urlencode "SERVICE=WFS" \
    --data-urlencode "VERSION=2.0.0" \
    --data-urlencode "REQUEST=GetFeature" \
    --data-urlencode "TYPENAME=yvw:WATERPIPES" \
    --data-urlencode "OUTPUTFORMAT=text/csv" \
    --data-urlencode "SRSNAME=EPSG:4326" \
    --data-urlencode "BBOX=$BBOX" \
    -o "$OUTPUT_DIR/water_pipes.csv"

if [ -f "$OUTPUT_DIR/water_pipes.csv" ] && [ -s "$OUTPUT_DIR/water_pipes.csv" ]; then
    echo -e "${GREEN}✓${NC} CSV saved to: $OUTPUT_DIR/water_pipes.csv"
    echo ""
    echo "Preview (first 5 lines):"
    head -n 5 "$OUTPUT_DIR/water_pipes.csv"
fi

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}All done! Check the '$OUTPUT_DIR' folder${NC}"
echo -e "${BLUE}=================================================${NC}"