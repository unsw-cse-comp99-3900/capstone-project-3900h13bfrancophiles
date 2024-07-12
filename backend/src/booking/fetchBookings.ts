import { Booking, IDatetimeRange, TypedGETRequest, TypedResponse } from '../types';
import { db } from '../index';
import { booking, hotdesk, room } from '../../drizzle/schema';
import { and, asc, count, desc, eq, gt, gte, inArray, lt, lte } from 'drizzle-orm';
import { formatBookingDates } from '../utils';
import typia, { tags } from 'typia';

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

interface UpcomingBookingsRequest {
  type: 'desks' | 'rooms' | 'all';
  sort: 'soonest' | 'latest';
}

export async function upcomingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const parsedQuery = typia.http.query<UpcomingBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    let subQuery;
    switch (parsedQuery.type) {
      case 'desks':
        subQuery = db.select({ id: hotdesk.id }).from(hotdesk)
        break;
      case 'rooms':
        subQuery = db.select({ id: room.id }).from(room)
        break;
      default:
        subQuery = db.select({ id: booking.spaceid }).from(booking)
    }

    const upcomingBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          inArray(booking.spaceid, subQuery),
          gt(booking.starttime, currentTime),
          eq(booking.zid, zid)
        )
      )
      .orderBy(parsedQuery.sort == 'soonest' ? asc(booking.starttime) : desc(booking.starttime))

    res.json({ bookings: upcomingBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming bookings' });
  }
}

interface PastBookingsRequest {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  type: 'desks' | 'rooms' | 'all';
  sort: 'newest' | 'oldest';
}

export async function pastBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[]; total: number }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<PastBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const page = parsedQuery.page;
    const limit = parsedQuery.limit;
    const offset = (page - 1) * limit;
    const currentTime = new Date().toISOString();

    let subQuery;
    switch (parsedQuery.type) {
      case 'desks':
        subQuery = db.select({ id: hotdesk.id }).from(hotdesk)
        break;
      case 'rooms':
        subQuery = db.select({ id: room.id }).from(room)
        break;
      default:
        subQuery = db.select({ id: booking.spaceid }).from(booking)
    }

    const totalBookings = await db
      .select({ count: count() })
      .from(booking)
      .where(and(
        inArray(booking.spaceid, subQuery),
        eq(booking.zid, zid),
        lt(booking.endtime, currentTime)
      ));

    const pastBookings = await db
      .select()
      .from(booking)
      .where(and(
        inArray(booking.spaceid, subQuery),
        eq(booking.zid, zid),
        lt(booking.endtime, currentTime)
      ))
      .orderBy(parsedQuery.sort == 'newest' ? desc(booking.starttime) : asc(booking.starttime))
      .limit(limit)
      .offset(offset);

    res.json({
      bookings: pastBookings.map(formatBookingDates),
      total: totalBookings[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past bookings' });
  }
}

export async function rangeOfBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<IDatetimeRange>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const datetimeStart = parsedQuery.datetimeStart;
    const datetimeEnd = parsedQuery.datetimeEnd;

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
