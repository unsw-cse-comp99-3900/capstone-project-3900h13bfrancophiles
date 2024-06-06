import cors from "cors";
import express, { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

import { PORT } from './config';

const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.post("/visit", async (req: Request, res: Response) => {
  await prisma.visits.create({
    data: {
      time: new Date().toISOString(),
    },
  });

  const visitCount = await prisma.visits.count();
  res.send(`${visitCount}`);
});
 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});