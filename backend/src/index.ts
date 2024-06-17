import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import express, { Request, Response } from "express";
import { Pool } from 'pg';

import { DATABASE_URL, PORT } from '../config';
import { visits } from '../drizzle/schema';
import { count } from 'drizzle-orm';

const pool = new Pool({
  connectionString: DATABASE_URL,
});
const db = drizzle(pool);

const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json("Hello world!");
});

app.post("/visit", async (req: Request, res: Response) => {
  await db
    .insert(visits)
    .values({ time: new Date().toISOString() });

  const results = await db
    .select({ count: count() })
    .from(visits);
  res.json(`${results[0].count}`);
});
 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});