import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import nodemailer from 'nodemailer';

import { DATABASE_URL, PORT } from '../config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import { approveBooking, declineBooking, pendingBookings, overlappingBookings } from './admin/handlers';
import { login, logout } from './auth/handlers';
import { authoriseAtLeast, validateToken } from './auth/middleware';
import { currentBookings, pastBookings, rangeOfBookings, upcomingBookings } from './booking/fetchBookings';
import { checkInBooking, checkOutBooking, deleteBooking, createBooking, editBooking } from './booking/manageBookings';
import { allSpaces, roomDetails, singleSpaceDetails, spaceAvailabilities, roomCanBook, deskPositions } from './spaces/handlers';
import { spaceStatus } from './status/handlers';
import { userDetails } from './user/handlers';

const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool);

export const emailTransporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'wilma44@ethereal.email',
    pass: 'GWCxu8xEeJAwGAMGzF',
  },
});

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/auth/login', login);
app.post('/auth/logout', validateToken, logout);

app.get('/bookings/current', validateToken, currentBookings);
app.get('/bookings/upcoming', validateToken, upcomingBookings);
app.get('/bookings/past', validateToken, pastBookings);
app.get('/bookings/range', validateToken, rangeOfBookings);

app.delete('/bookings/delete', validateToken, deleteBooking);

app.post('/bookings/checkin', validateToken, checkInBooking);
app.post('/bookings/checkout', validateToken, checkOutBooking);
app.delete('/bookings/delete', validateToken, authoriseAtLeast('hdr'), deleteBooking);
app.post('/bookings/create', validateToken, authoriseAtLeast('hdr'), createBooking);
app.put('/bookings/edit', validateToken, editBooking);

app.get('/spaces', validateToken, allSpaces);
app.get('/spaces/:spaceId', validateToken, singleSpaceDetails);
app.get('/rooms', validateToken, roomDetails);
app.get('/status', validateToken, spaceStatus);
app.get('/availabilities/:spaceId', validateToken, spaceAvailabilities);
app.get('/bookable/:spaceId', validateToken, roomCanBook);
app.get('/desks', validateToken, deskPositions);

app.get('/admin/bookings/pending', validateToken, authoriseAtLeast('admin'), pendingBookings);
app.put('/admin/bookings/approve', validateToken, authoriseAtLeast('admin'), approveBooking);
app.put('/admin/bookings/decline', validateToken, authoriseAtLeast('admin'), declineBooking);
app.get('/admin/bookings/overlapping', validateToken, authoriseAtLeast('admin'), overlappingBookings);

app.get('/users/:zid', validateToken, userDetails);

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const closeServer = async () => {
  server.close((err) => err && console.log(`${err}`));
  server.closeAllConnections();
  emailTransporter.close();
  await pool.end();
};

process.on('SIGTERM', closeServer);
process.on('SIGINT', closeServer);
