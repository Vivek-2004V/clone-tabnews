import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not set. Database features will not work.");
  console.warn("Set DATABASE_URL in .env.local to enable database features");
}

const pool: any = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Handle pool errors gracefully
if (pool.on) {
  pool.on("error", (err: any) => {
    console.error("Unexpected error on idle client", err);
  });
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export default pool;
