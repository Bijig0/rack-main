import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway',
  },
});
