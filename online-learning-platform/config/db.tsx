import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

function getDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined. Add it to .env.local (e.g. a Neon or Postgres connection string).');
  }
  
  try {
    // Use neon HTTP client for Neon serverless (works with both HTTP and WebSocket)
    const sql = neon(connectionString);
    return drizzle(sql);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Lazy init: throw only when db is used, so the app and other routes still load
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    try {
      const dbInstance = getDb();
      // Type assertion needed for Proxy to work with dynamic property access
      return (dbInstance as unknown as Record<string | symbol, unknown>)[prop];
    } catch (error) {
      console.error('Database access error:', error);
      throw error;
    }
  },
});
