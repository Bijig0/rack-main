import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

const sql = postgres(connectionString, { max: 1 });

async function createTables() {
  console.log('Creating new tables...');

  // Create property table
  await sql`
    CREATE TABLE IF NOT EXISTS property (
      id UUID PRIMARY KEY NOT NULL,
      address_common_name TEXT NOT NULL,
      bedroom_count INTEGER,
      bathroom_count INTEGER,
      property_type TEXT,
      land_area_sqm NUMERIC,
      property_image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('Created property table');

  // Create index on property address
  await sql`
    CREATE INDEX IF NOT EXISTS idx_property_address ON property(address_common_name)
  `;
  console.log('Created property address index');

  // Create appraisal table
  await sql`
    CREATE TABLE IF NOT EXISTS appraisal (
      id UUID PRIMARY KEY NOT NULL,
      property_id UUID NOT NULL REFERENCES property(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      pdf_url TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log('Created appraisal table');

  // Create index on appraisal property_id
  await sql`
    CREATE INDEX IF NOT EXISTS idx_appraisal_property_id ON appraisal(property_id)
  `;
  console.log('Created appraisal property_id index');

  console.log('Tables created successfully!');
  await sql.end();
  process.exit(0);
}

createTables().catch((err) => {
  console.error('Failed to create tables:', err);
  process.exit(1);
});
