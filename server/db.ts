import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("❌ CRITICAL ERROR: DATABASE_URL is missing from Environment Variables!");
    throw new Error('DATABASE_URL is missing');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
