import { configDotenv } from 'dotenv';

configDotenv();

export const PORT = process.env.PORT || 2000;