import { configDotenv } from 'dotenv';
import { defineConfig as drizzleConfig } from "drizzle-kit";

// Environment variables
configDotenv();
export const PORT = process.env.PORT || 2000;
export const DATABASE_URL = process.env.DATABASE_URL || "";

export default drizzleConfig({
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  }
});
