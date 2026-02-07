import { drizzle } from 'drizzle-orm/neon-http';

const connectionString = process.env.DATABASE_URL;

function getDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined. Add it to .env.local (e.g. a Neon or Postgres connection string).');
  }
  return drizzle(connectionString);
}

// Lazy init: throw only when db is used, so the app and other routes still load
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as Record<string | symbol, unknown>)[prop];
  },
});
