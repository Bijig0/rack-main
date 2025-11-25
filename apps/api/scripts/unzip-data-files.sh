#!/bin/bash

# Script to unzip large GeoJSON data files after cloning
# Run this after cloning the repository to extract data files

set -e

echo "📦 Unzipping data files..."

# Define the data files to unzip (relative to project root)
DATA_FILES=(
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getTransportData/public_transport_lines.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getTransportData/public_transport_stops.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/getInfrastructureData/getSewageData/Sewerage_Network_Main_Pipelines.geojson"
  "src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createEnvironmentalSection/getEnvironmentalData/getBushFireRiskData/getFireManagementZones/fire_management_zones.geojson"
)

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$PROJECT_ROOT"

FILES_UNZIPPED=0
FILES_SKIPPED=0

for FILE in "${DATA_FILES[@]}"; do
  DIR=$(dirname "$FILE")
  FILENAME=$(basename "$FILE")
  ZIP_FILE="$DIR/$FILENAME.gz"

  if [ -f "$ZIP_FILE" ]; then
    # Check if unzipped file already exists and is newer than zip
    if [ -f "$FILE" ] && [ "$FILE" -nt "$ZIP_FILE" ]; then
      echo "  ✓ $FILENAME already exists and is up to date"
      FILES_SKIPPED=$((FILES_SKIPPED + 1))
    else
      echo "  Extracting $FILENAME..."
      gunzip -c "$ZIP_FILE" > "$FILE"
      FILES_UNZIPPED=$((FILES_UNZIPPED + 1))
    fi
  else
    if [ -f "$FILE" ]; then
      echo "  ✓ $FILENAME already exists (no compressed version found)"
      FILES_SKIPPED=$((FILES_SKIPPED + 1))
    else
      echo "  ⚠️  Warning: Neither $FILENAME nor $FILENAME.gz found"
    fi
  fi
done

echo ""
if [ $FILES_UNZIPPED -eq 0 ]; then
  echo "✓ All data files are already extracted ($FILES_SKIPPED files up to date)"
else
  echo "✓ Extracted $FILES_UNZIPPED file(s), $FILES_SKIPPED already up to date"
fi

echo ""
echo "🚀 Data files are ready! You can now run the application."
