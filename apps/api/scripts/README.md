# Scripts Directory

This directory contains utility scripts for managing large data files in the repository.

## Available Scripts

### `zip-data-files.sh`
Compresses large GeoJSON data files to `.geojson.gz` format for storage in git.

**Usage:**
```bash
./scripts/zip-data-files.sh
# or
npm run data:zip
```

**Features:**
- Only compresses files that have been modified
- Shows progress for each file
- Skips files that are already up to date
- Uses gzip compression (~93% reduction)

### `unzip-data-files.sh`
Extracts compressed `.geojson.gz` files back to working `.geojson` files.

**Usage:**
```bash
./scripts/unzip-data-files.sh
# or
npm run data:unzip
# or
npm run data:setup
```

**Features:**
- Extracts all compressed data files
- Skips files that are already extracted and up to date
- Runs automatically after `npm install` via postinstall hook
- Provides clear feedback on what was extracted

## How the Workflow Works

### For Contributors

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd appraisal-pdf-generator-script
   npm install
   ```
   The postinstall hook automatically extracts all data files.

2. **Make changes to code (not data files)**
   - Work normally with the extracted `.geojson` files
   - They are ignored by git

3. **Push changes**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
   The pre-push hook automatically compresses data files.

### Updating Data Files

If you need to update the large data files:

1. **Modify the `.geojson` file** as needed

2. **Compress it**
   ```bash
   npm run data:zip
   ```

3. **Commit the compressed version**
   ```bash
   git add src/path/to/file.geojson.gz
   git commit -m "Update data file"
   git push
   ```

## Git Hooks

### Pre-Push Hook (`.husky/pre-push`)
- Automatically runs `zip-data-files.sh` before every push
- Warns if uncompressed `.geojson` files are accidentally staged
- Prevents accidentally committing large files

### Post-Install Hook (`package.json` postinstall)
- Automatically runs `unzip-data-files.sh` after `npm install`
- Ensures working files are always available after cloning

## Technical Details

**Compression Method:** gzip (RFC 1952)
- Fast compression/decompression
- Standard format compatible with all systems
- Excellent compression ratio (~93% for GeoJSON)

**Files Managed:**
1. `public_transport_lines.geojson` - 362 MB → 78 MB
2. `fire_management_zones.geojson` - 140 MB → 33 MB
3. `public_transport_stops.geojson` - 7.3 MB → 728 KB
4. `Sewerage_Network_Main_Pipelines.geojson` - 2.6 MB → 388 KB

**Total Storage Savings:** 512 MB → 112 MB (78% reduction)

## Troubleshooting

### Scripts not executable
```bash
chmod +x scripts/*.sh
chmod +x .husky/pre-push
```

### Data files missing after clone
```bash
npm run data:setup
```

### Pre-push hook not running
Check that Husky is installed:
```bash
npm run prepare
```

### Need to manually test the workflow
```bash
# Test compression
./scripts/zip-data-files.sh

# Test extraction
./scripts/unzip-data-files.sh
```
