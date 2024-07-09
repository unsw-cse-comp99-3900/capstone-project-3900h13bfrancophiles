import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { DATABASE_URL, PORT } from '../config';
import { Pool } from 'pg';
import { drizzle } from "drizzle-orm/node-postgres";
import { login, logout } from './auth/handlers';
import { authoriseAtLeast, validateToken } from './auth/middleware';
import {
  currentBookings,
  upcomingBookings,
  pastBookings,
  rangeOfBookings,
  checkInBooking,
  checkOutBooking,
  deleteBooking,
  createBooking
} from './booking/handlers';
import { allSpaces, roomDetails, singleSpaceDetails, spaceAvailabilities } from "./spaces/handlers";
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

app.delete("/bookings/delete", validateToken, authoriseAtLeast("hdr"), deleteBooking);
app.post("/bookings/create", validateToken, authoriseAtLeast("hdr"), createBooking);

app.post("/bookings/checkin", validateToken, checkInBooking);
app.post("/bookings/checkout", validateToken, checkOutBooking);

app.get("/spaces", validateToken, allSpaces);
app.get("/spaces/:spaceId", validateToken, singleSpaceDetails);
app.get("/rooms", validateToken, roomDetails);
app.get("/status", validateToken, spaceStatus);
app.get("/availabilities/:spaceId", validateToken, spaceAvailabilities);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
