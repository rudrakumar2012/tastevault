import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This ensures it doesn't crash if the env var is missing during build
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });