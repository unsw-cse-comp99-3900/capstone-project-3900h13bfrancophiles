import { configDotenv } from 'dotenv';

// Environment variables
configDotenv();
export const PORT = process.env.PORT || 2000;
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const AUTH_SECRET = process.env.AUTH_SECRET || "secret";

// Booking configuration
export const MINIMUM_BOOKING_LENGTH_MINUTES = 15;
export const MINIMUM_BOOKING_EDIT_WINDOW_MINUTES = 60;
