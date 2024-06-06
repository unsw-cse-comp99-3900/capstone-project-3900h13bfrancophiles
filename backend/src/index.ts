import cors from "cors";
import express, { Request, Response } from "express";

import { PORT } from './config';

const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});