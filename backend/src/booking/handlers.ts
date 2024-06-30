// Booking endpoint handlers

import { db } from '../index'
import { count, sql, and, eq, lt, lte, gt, gte, desc } from "drizzle-orm"
import { booking, hotdesk } from '../../drizzle/schema';
import { Booking, AnonymousBooking, IDatetimeRange, TypedGETRequest, TypedResponse } from '../types';
import typia, { tags } from "typia";
import { formatBookingDates, anonymiseBooking } from '../utils';

export async function currentBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          lt(booking.starttime, currentTime),
          gt(booking.endtime, currentTime),
          eq(booking.zid, zid)
        )
    );

    res.json({ bookings: currentBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current bookings' });
  }
}

export async function upcomingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    const upcomingBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          gt(booking.starttime, currentTime),
          eq(booking.zid, zid)
        )
      );

    res.json({ bookings: upcomingBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming bookings' });
  }
}

interface IPagination {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
}

export async function pastBookings(
  req: TypedGETRequest<{ page: string, limit: string }>,
  res: TypedResponse<{ bookings: Booking[];  total: number }>,
) {
  try {
    if (!typia.is<IPagination>({ page: parseInt(req.query.page), limit: parseInt(req.query.limit) }) ) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;

    const totalBookingsCount = await db
      .select({ count: count() })
      .from(booking)
      .where(
        eq(booking.zid, zid)
      );

    const pastBookings = await db
      .select()
      .from(booking)
      .where(
        eq(booking.zid, zid)
      )
      .orderBy(
        desc(booking.starttime)
      )
      .limit(limit)
      .offset(offset);

    res.json({
      bookings: pastBookings.map(formatBookingDates),
      total: totalBookingsCount[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past bookings' });
  }
}

export async function rangeOfBookings(
  req: TypedGETRequest<{ datetimeStart: string, datetimeEnd: string }>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    if (!typia.is<IDatetimeRange>(req.query)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = req.token.user;
    const datetimeStart = req.query.datetimeStart;
    const datetimeEnd = req.query.datetimeEnd;

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          lte(booking.starttime, datetimeEnd),
          gte(booking.endtime, datetimeStart),
          eq(booking.zid, zid)
        )
      );

    res.json({ bookings: currentBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

export async function currentHotdeskBookings(
  req: TypedGETRequest<{ floor: string }>,
  res: TypedResponse<{ bookings: AnonymousBooking[] }>,
) {
  try {
    if (!typia.is<{ floor: string }>(req.query) ) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const floor = req.query.floor;
    const currentTime = new Date().toISOString();

    const currentBookings = await db
      .select({
        id: booking.id,
        zid: booking.zid,
        starttime: booking.starttime,
        endtime: booking.endtime,
        spaceid: booking.spaceid,
        currentstatus: booking.currentstatus,
        description: booking.description
      })
      .from(booking)
      .innerJoin(hotdesk, eq(booking.spaceid, hotdesk.id))
      .where(
        and(
          lt(booking.starttime, currentTime),
          gt(booking.endtime, currentTime),
          eq(hotdesk.floor, floor)
        )
    );

    res.json({ bookings: currentBookings.map(formatBookingDates).map(anonymiseBooking) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hot desk availability' });
  }
}
