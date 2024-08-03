import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import wrap from "express-async-handler";
import morgan from "morgan";
import nodemailer from "nodemailer";

import { DATABASE_URL, PORT } from "../config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import {
  approveBooking,
  declineBooking,
  overlappingBookings,
  pendingBookings,
} from "./admin/handlers";
import { login, logout } from "./auth/handlers";
import { authoriseAtLeast, validateToken } from "./auth/middleware";
import {
  currentBookings,
  pastBookings,
  rangeOfBookings,
  upcomingBookings,
} from "./booking/fetchBookings";
import {
  checkInBooking,
  checkOutBooking,
  createBooking,
  deleteBooking,
  editBooking,
} from "./booking/manageBookings";
import {
  allSpaces,
  deskPositions,
  roomCanBook,
  roomDetails,
  singleSpaceDetails,
  spaceAvailabilities,
} from "./spaces/handlers";
import { spaceStatus } from "./status/handlers";
import { userDetails } from "./user/handlers";
import { generateReport, getReportSpaces, getReportTypes } from "./reports/handlers";

const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool);

export const emailTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  pool: true,
  auth: {
    user: "wilma44@ethereal.email",
    pass: "GWCxu8xEeJAwGAMGzF",
  },
});

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/auth/login", wrap(login));
app.post("/auth/logout", validateToken, wrap(logout));

app.get("/bookings/current", validateToken, wrap(currentBookings));
app.get("/bookings/upcoming", validateToken, wrap(upcomingBookings));
app.get("/bookings/past", validateToken, wrap(pastBookings));
app.get("/bookings/range", validateToken, wrap(rangeOfBookings));

app.delete("/bookings/delete", validateToken, wrap(deleteBooking));

app.post("/bookings/checkin", validateToken, wrap(checkInBooking));
app.post("/bookings/checkout", validateToken, wrap(checkOutBooking));
app.delete("/bookings/delete", validateToken, authoriseAtLeast("hdr"), wrap(deleteBooking));
app.post("/bookings/create", validateToken, authoriseAtLeast("hdr"), wrap(createBooking));
app.put("/bookings/edit", validateToken, wrap(editBooking));

app.get("/spaces", validateToken, wrap(allSpaces));
app.get("/spaces/:spaceId", validateToken, wrap(singleSpaceDetails));
app.get("/rooms", validateToken, wrap(roomDetails));
app.get("/status", validateToken, wrap(spaceStatus));
app.get("/availabilities/:spaceId", validateToken, wrap(spaceAvailabilities));
app.get("/bookable/:spaceId", validateToken, wrap(roomCanBook));
app.get("/desks", validateToken, wrap(deskPositions));

app.get("/admin/bookings/pending", validateToken, authoriseAtLeast("admin"), wrap(pendingBookings));
app.put("/admin/bookings/approve", validateToken, authoriseAtLeast("admin"), wrap(approveBooking));
app.put("/admin/bookings/decline", validateToken, authoriseAtLeast("admin"), wrap(declineBooking));
app.get(
  "/admin/bookings/overlapping/:bookingId",
  validateToken,
  authoriseAtLeast("admin"),
  wrap(overlappingBookings),
);

app.post("/admin/reports/generate", validateToken, authoriseAtLeast("admin"), wrap(generateReport));
app.get("/admin/reports/types", validateToken, authoriseAtLeast("admin"), wrap(getReportTypes));
app.get("/admin/reports/spaces", validateToken, authoriseAtLeast("admin"), wrap(getReportSpaces));

app.get("/users/:zid", validateToken, wrap(userDetails));

// Error-handling middleware
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack ?? err);
  res.status(500).json({ error: "Internal server error" });
  next();
});

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const closeServer = async () => {
  server.close((err) => err && console.log(`${err}`));
  server.closeAllConnections();
  emailTransporter.close();
  await pool.end();
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);
