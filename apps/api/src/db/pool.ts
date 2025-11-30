import pg from "pg";

const { Pool } = pg;

// Railway provides DATABASE_URL, parse it if available
// Otherwise use individual connection parameters for local development
const databaseUrl = process.env.DATABASE_URL;

const dbConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Railway Postgres requires SSL
      },
    }
  : {
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      database: process.env.POSTGRES_DB || "barry_db",
      user: process.env.POSTGRES_USER || "barry_user",
      password: process.env.POSTGRES_PASSWORD || "barry_password",
    };

// Create a singleton pool instance
let pool: pg.Pool | null = null;

export const getPool = (): pg.Pool => {
  if (!pool) {
    pool = new Pool(dbConfig);

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle database client", err);
    });
  }

  return pool;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
