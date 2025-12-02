import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';
const sql = postgres(connectionString);

async function migrate() {
  console.log('Running migration: Add pdf_url, status, and identifier columns...');

  try {
    // Add identifier column (unique string identifier for reports like 'sample')
    await sql`
      ALTER TABLE rental_appraisal_data
      ADD COLUMN IF NOT EXISTS identifier VARCHAR(255) UNIQUE
    `;
    console.log('✅ Added identifier column');

    // Add status column (pending, processing, completed, failed)
    await sql`
      ALTER TABLE rental_appraisal_data
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'
    `;
    console.log('✅ Added status column');

    // Add pdf_url column (URL to the generated PDF)
    await sql`
      ALTER TABLE rental_appraisal_data
      ADD COLUMN IF NOT EXISTS pdf_url TEXT
    `;
    console.log('✅ Added pdf_url column');

    // Create index on identifier for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_rental_appraisal_identifier
      ON rental_appraisal_data (identifier)
    `;
    console.log('✅ Created index on identifier');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate().catch(console.error);
