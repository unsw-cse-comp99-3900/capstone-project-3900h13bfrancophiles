// Booking endpoint handlers

import { DATABASE_URL, PORT } from '../../config';
import { Pool } from 'pg';
import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres";
import { booking } from '../../drizzle/schema';
import { TypedRequest, TypedResponse, DateTimeRange } from '../types';
import typia from 'typia';

const pool = new Pool({
    connectionString: DATABASE_URL,
  });
const db = drizzle(pool);

export async function currentBookings(
    req: TypedRequest,
    res: TypedResponse,
  ) {
    try {
        // TODO: Get zid from active tokens
        const zid = 1;
        const currentTime = new Date().toISOString();

        const currentBookings = await db
            .select({
                id: booking.id,
                starttime: booking.starttime,
                endttime: booking.endtime,
                spaceId: booking.spaceid,
                currentStatus: booking.currentstatus
            })
            .from(booking)
            .where(
                sql`${booking.starttime} < ${currentTime} AND ${booking.endtime} > ${currentTime} AND ${booking.zid} == ${zid}`
            );

        res.json({ bookings: currentBookings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch current bookings' });
    }
  }

export async function upcomingBookings(
    req: TypedRequest,
    res: TypedResponse,
  ) {
    try {
        // TODO: Get zid from active tokens
        const zid = 1;
        const currentTime = new Date().toISOString();

        const currentBookings = await db
            .select({
                id: booking.id,
                starttime: booking.starttime,
                endttime: booking.endtime,
                spaceId: booking.spaceid,
                currentStatus: booking.currentstatus
            })
            .from(booking)
            .where(
                sql`${booking.starttime} > ${currentTime} AND ${booking.zid} == ${zid}`
            );

        res.json({ bookings: currentBookings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch current bookings' });
    }
  }

export async function pastBookings(
    req: TypedRequest,
    res: TypedResponse,
  ) {
    try {
        if (!typia.is<DateTimeRange>(req.body)) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }
        // TODO: Get zid from active tokens
        const zid = 1;
        const start = req.params.start;
        var end = new Date().toISOString();
        if (req.params.end !== undefined && req.params.end !== null) {
            end = req.params.end;
        }

        const currentBookings = await db
            .select({
                id: booking.id,
                starttime: booking.starttime,
                endttime: booking.endtime,
                spaceId: booking.spaceid,
                currentStatus: booking.currentstatus
            })
            .from(booking)
            .where(
                sql`${booking.starttime} <= ${end} AND ${booking.endtime} >= ${start} AND ${booking.zid} == ${zid}`
            );

        res.json({ bookings: currentBookings });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch past bookings' });
    }
  }
