import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './config';

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
  }
});
