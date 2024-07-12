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
  checkInBooking,
  checkOutBooking,
  deleteBooking,
  createBooking,
  editBooking
} from './booking/manageBookings';
import { allSpaces, roomDetails, singleSpaceDetails, spaceAvailabilities } from "./spaces/handlers";
import { spaceStatus } from './status/handlers';
import { currentBookings, pastBookings, rangeOfBookings, upcomingBookings } from './booking/fetchBookings';
import {pendingBookings} from "./admin/handlers";

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

app.put("/bookings/checkin", validateToken, checkInBooking);
app.put("/bookings/checkout", validateToken, checkOutBooking);
app.put("/bookings/edit", validateToken, editBooking);

app.get("/spaces", validateToken, allSpaces);
app.get("/spaces/:spaceId", validateToken, singleSpaceDetails);
app.get("/rooms", validateToken, roomDetails);
app.get("/status", validateToken, spaceStatus);
app.get("/availabilities/:spaceId", validateToken, spaceAvailabilities);

app.get("/admin/bookings/pending", validateToken, authoriseAtLeast("admin"), pendingBookings);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
