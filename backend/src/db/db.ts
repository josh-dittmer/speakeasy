import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres'

const databaseUrl = process.env.DATABASE_URL!;

export const db = drizzle(databaseUrl);