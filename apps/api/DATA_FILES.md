# Large Data Files Management

This project includes large GeoJSON data files that are compressed to reduce repository size.

## Files Managed

The following large data files are automatically compressed:

1. **public_transport_lines.geojson** (362 MB) - Public transport route lines
2. **fire_management_zones.geojson** (140 MB) - Fire management zone boundaries
3. **public_transport_stops.geojson** (7.3 MB) - Public transport stop locations
4. **Sewerage_Network_Main_Pipelines.geojson** (2.6 MB) - Main sewerage pipeline network

## Setup After Cloning

When you clone this repository, the data files will be automatically extracted during `npm install`:

```bash
git clone <repository-url>
cd appraisal-pdf-generator-script
npm install  # This automatically runs the data:setup script
```

### Manual Setup

If you need to manually extract the data files:

```bash
npm run data:setup
```

or

```bash
./scripts/unzip-data-files.sh
```

## Before Pushing Changes

Before pushing changes to the repository, you should compress any modified data files:

```bash
npm run data:zip
```

This is also automatically done by the pre-push git hook.

## How It Works

### Automatic Compression (Pre-Push Hook)

A git pre-push hook automatically runs before every push to:
- Compress any modified large data files to `.geojson.gz` format
- Warn if uncompressed `.geojson` files are accidentally staged

### Automatic Extraction (Post-Install)

After running `npm install`, the postinstall script automatically:
- Extracts all compressed `.geojson.gz` files
- Creates the working `.geojson` files needed by the application

### Git Ignore Configuration

The uncompressed `.geojson` files are in `.gitignore`, ensuring only the compressed `.geojson.gz` versions are committed to the repository. This keeps the repository size manageable.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run data:setup` | Extract all compressed data files (runs automatically after install) |
| `npm run data:zip` | Compress all large data files to .gz format |
| `npm run data:unzip` | Extract all compressed data files (alias for data:setup) |

## File Compression Ratios

| File | Original Size | Compressed Size | Ratio |
|------|--------------|-----------------|-------|
| public_transport_lines.geojson | 362 MB | ~25 MB | 93% reduction |
| fire_management_zones.geojson | 140 MB | ~10 MB | 93% reduction |
| public_transport_stops.geojson | 7.3 MB | ~500 KB | 93% reduction |
| Sewerage_Network_Main_Pipelines.geojson | 2.6 MB | ~180 KB | 93% reduction |

**Total savings:** ~475 MB reduced to ~36 MB (92% reduction)

## Troubleshooting

### Data files not found after cloning

Run the setup script manually:
```bash
npm run data:setup
```

### Changes to data files not being committed

This is expected! Only the compressed `.gz` versions should be committed. To update a data file:

1. Modify the `.geojson` file as needed
2. Run `npm run data:zip` to compress it
3. Commit the `.geojson.gz` file
4. Push your changes

### Pre-push hook failing

If the pre-push hook fails, you can:
- Check that the scripts have execute permissions: `chmod +x scripts/*.sh`
- Manually run the zip script: `npm run data:zip`
- Check the `.husky/pre-push` file has execute permissions

## Technical Details

- **Compression:** Uses gzip compression (RFC 1952)
- **Format:** `.geojson.gz` files containing compressed GeoJSON data
- **Compatibility:** Standard gzip format, readable by any gzip-compatible tool
- **Automation:** Husky git hooks + npm scripts for seamless workflow
