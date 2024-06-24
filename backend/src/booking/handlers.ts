// Booking endpoint handlers

import { db } from '../index'
import { sql, count } from "drizzle-orm"
import { booking } from '../../drizzle/schema';
import { TypedRequest, TypedResponse, Booking } from '../types';
import typia, { tags } from "typia";

export async function currentBookings(
  req: TypedRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    const currentBookings = await db
      .select()
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
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        sql`${booking.starttime} > ${currentTime} AND ${booking.zid} = ${zid}`
      );

    res.json({ bookings: currentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current bookings' });
  }
}


interface IPagination {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
}

export async function pastBookings(
  req: TypedRequest<IPagination>,
  res: TypedResponse<{ bookings: Booking[];  total: number}>,
) {
  try {
    if (!typia.is<IPagination>(req.body) ) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const page = req.body.page;
    const limit = req.body.limit;
    const offset = (page - 1) * limit;

    const totalBookingsCount = await db
      .select({ count: count() })
      .from(booking)
      .where(
        sql`${booking.zid} = ${zid}`
      );

    const pastBookings = await db
      .select()
      .from(booking)
      .where(
        sql`${booking.zid} = ${zid}`
      )
      .orderBy(
        sql`${booking.starttime} DESC`
      )
      .limit(limit)
      .offset(offset);

    res.json({ bookings: pastBookings, total: totalBookingsCount[0].count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past bookings' });
  }
}

export async function rangeOfBookings(
  req: TypedRequest<{ datetimeStart: string, datetimeEnd: string }>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    if (!typia.is<{ datetimeStart: string, datetimeEnd: string }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = req.token.user;
    const datetimeStart = req.body.datetimeStart;
    const datetimeEnd = req.body.datetimeEnd;

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        sql`${booking.starttime} <= ${datetimeEnd} AND ${booking.endtime} >= ${datetimeStart} AND ${booking.zid} = ${zid}`
      );

    res.json({ bookings: currentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past bookings' });
  }
}
