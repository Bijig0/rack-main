import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

const main = async () => {
  console.log('🚀 Running migrations...');

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  await migrate(db, { migrationsFolder: 'src/db/migrations' });

  console.log('✅ Migrations completed!');
  await migrationClient.end();
  process.exit(0);
};

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
