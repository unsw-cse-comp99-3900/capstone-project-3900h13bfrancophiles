import { configDotenv } from 'dotenv';

// Environment variables
configDotenv({ path: `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}` });
export const PORT = process.env.PORT || 2000;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const AUTH_SECRET = process.env.AUTH_SECRET || "secret";
