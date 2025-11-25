#!/bin/bash

# Script to zip large GeoJSON data files before committing
# This reduces the repository size significantly

set -e

echo "🗜️  Zipping large data files..."

# Define the data files to zip (relative to project root)
DATA_FILES=(
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getTransportData/public_transport_lines.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getTransportData/public_transport_stops.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getSewageData/Sewerage_Network_Main_Pipelines.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createEnvironmentalSection/getEnvironmentalData/getBushFireRiskData/getFireManagementZones/fire_management_zones.geojson"
)

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_ROOT"

# Check if any files need zipping
FILES_ZIPPED=0

for FILE in "${DATA_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    # Get the directory and filename
    DIR=$(dirname "$FILE")
    FILENAME=$(basename "$FILE")
    ZIP_FILE="$DIR/$FILENAME.gz"

    # Only zip if the .geojson file is newer than the .gz file or .gz doesn't exist
    if [ ! -f "$ZIP_FILE" ] || [ "$FILE" -nt "$ZIP_FILE" ]; then
      echo "  Compressing $FILENAME..."
      gzip -c "$FILE" > "$ZIP_FILE"
      FILES_ZIPPED=$((FILES_ZIPPED + 1))
    else
      echo "  ✓ $FILENAME already compressed and up to date"
    fi
  else
    echo "  ⚠️  Warning: $FILE not found (may already be zipped)"
  fi
done

if [ $FILES_ZIPPED -eq 0 ]; then
  echo "✓ All data files are already compressed"
else
  echo "✓ Compressed $FILES_ZIPPED file(s)"
fi
