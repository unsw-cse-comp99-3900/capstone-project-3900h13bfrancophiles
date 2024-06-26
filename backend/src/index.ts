import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { DATABASE_URL, PORT } from '../config';
import { Pool } from 'pg';
import { drizzle } from "drizzle-orm/node-postgres";
import { login, logout } from './auth/handlers';
import { validateToken } from './auth/middleware';
import { currentBookings, upcomingBookings, pastBookings, rangeOfBookings } from './booking/handlers';
import { roomDetails } from "./spaces/handlers";
import { spaceStatus } from './status/handlers';

const pool = new Pool({
  connectionString: DATABASE_URL,
  });
export const db = drizzle(pool);

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post("/auth/login", login);
app.post("/auth/logout", validateToken, logout);

app.get("/bookings/current", validateToken, currentBookings);
app.get("/bookings/upcoming", validateToken, upcomingBookings);
app.get("/bookings/past", validateToken, pastBookings);
app.get("/bookings/range", validateToken, rangeOfBookings);

app.get("/rooms", validateToken, roomDetails);
app.get("/status", validateToken, spaceStatus);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
