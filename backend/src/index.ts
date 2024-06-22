import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { PORT } from '../config';
import { login, logout } from './auth/handlers';
import { validateToken } from './auth/middleware';
import { currentBookings, upcomingBookings, pastBookings } from './booking/handlers';

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post("/auth/login", login);
app.post("/auth/logout", validateToken, logout);

app.get("/bookings/current", currentBookings);
app.get("/bookings/current", upcomingBookings);
app.get("/bookings/current", pastBookings);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
