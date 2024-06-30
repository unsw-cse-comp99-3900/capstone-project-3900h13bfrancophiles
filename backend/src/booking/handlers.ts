// Booking endpoint handlers

import { db } from '../index'
import { count, sql, and, eq, lt, lte, gt, gte, desc } from "drizzle-orm"
import { booking } from '../../drizzle/schema';
import { Booking, IDatetimeRange, TypedGETRequest, TypedRequest, TypedResponse } from '../types';
import typia, { tags } from "typia";
import { formatBookingDates } from '../utils';

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

export async function deleteBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{}>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const deletedBooking = await db
      .delete(booking)
      .where(
        and(
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user)
        )
      )
      .returning();

    if (deletedBooking.length != 1) {
      res.status(403).json({ error: "Booking id does not exist for this user" });
      return;
    }

    // TODO: send an email to the user confirming deletion
    // email.deletionConfirmation(req.token.user, deletedBooking[0])

    res.json({});
  } catch (error) {
    res.status(204);
  }
}
