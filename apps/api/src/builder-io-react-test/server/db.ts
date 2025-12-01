import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

// Raw SQL client for queries (avoiding drizzle-orm version conflicts)
export const sql = postgres(connectionString);
