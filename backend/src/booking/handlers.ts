// Booking endpoint handlers

import { db } from '../index'
import { sql } from "drizzle-orm"
import { booking } from '../../drizzle/schema';
import { TypedRequest, TypedResponse, DateTimeRange } from '../types';
import typia from 'typia';

export async function currentBookings(
  req: TypedRequest,
  res: TypedResponse,
) {
  try {
    const zid = req.token.user;
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
        sql`${booking.starttime} < ${currentTime} AND ${booking.endtime} > ${currentTime} AND ${booking.zid} = ${zid}`
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
    const zid = req.token.user;
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
        sql`${booking.starttime} > ${currentTime} AND ${booking.zid} = ${zid}`
      );

    res.json({ bookings: currentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current bookings' });
  }
}

export async function pastBookings(
  req: TypedRequest<DateTimeRange>,
  res: TypedResponse,
) {
  try {
    if (!typia.is<DateTimeRange>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = req.token.user;
    const start = req.body.start;
    const end = req.body.end;

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
        sql`${booking.starttime} <= ${end} AND ${booking.endtime} >= ${start} AND ${booking.zid} = ${zid}`
      );

    res.json({ bookings: currentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past bookings' });
  }
}
