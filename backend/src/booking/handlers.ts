// Booking endpoint handlers

import { db } from '../index'
import { count, sql, and, eq, lt, lte, gt, gte, desc } from "drizzle-orm"
import { booking } from '../../drizzle/schema';
import { Booking, IDatetimeRange, TypedGETRequest, TypedRequest, TypedResponse } from '../types';
import typia, { tags } from "typia";
import { formatBookingDates, withinDateRange as dateInRange } from '../utils';

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

export async function checkInBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{}>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const currentTime = new Date();

    const currentBooking = await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.zid, req.token.user),
        eq(booking.id, req.body.id)
      )
    );

    if (currentBooking.length != 1) {
      res.status(403).json({ error: "Booking id does not exist for this user" });
      return;
    }

    // 5 minute buffer value too long?
    if (!dateInRange(currentTime, new Date(currentBooking[0].starttime), new Date(currentBooking[0].endtime), 5)) {
      res.status(403).json({ error: "Outside booking time window" });
      return;
    }

    switch (currentBooking[0].currentstatus) {
      case 'pending':
        res.status(403).json({ error: "Booking not yet confirmed" });
        break;
      case 'checkedin':
        res.status(403).json({ error: "Already checked in" });
        break;
      case 'completed':
        res.status(403).json({ error: "Already checked out" });
        break;
    }

    const updatedBooking = await db
      .update(booking)
      .set({ checkintime: currentTime.toISOString(), currentstatus: "checkedin" })
      .where(
        and(
          lt(booking.starttime, currentTime.toISOString()),
          gt(booking.endtime, currentTime.toISOString()),
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user)))
      .returning();

    if (updatedBooking.length != 1) {
      res.status(500).json({ error: "Booking modified during operation" });
      return;
    }

  // If prior booking in this space didn't check out, update their checkout time now?

    res.json({});
  } catch (error) {
    res.status(204);
  }
}

export async function checkOutBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{}>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const currentTime = new Date();

    const currentBooking = await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.zid, req.token.user),
        eq(booking.id, req.body.id),
        eq(booking.currentstatus, "confirmed")
      )
    );

    if (currentBooking.length != 1) {
      res.status(403).json({ error: "Booking id does not exist for this user" });
      return;
    }

    // 5 minute buffer value too long?
    if (!dateInRange(currentTime, new Date(currentBooking[0].starttime), new Date(currentBooking[0].endtime), 5)) {
      res.status(403).json({ error: "Outside booking time window" });
      return;
    }

    switch (currentBooking[0].currentstatus) {
      case 'pending':
        res.status(403).json({ error: "Booking not yet confirmed" });
        break;
      case 'confirmed':
        res.status(403).json({ error: "Not yet checked in" });
        break;
      case 'completed':
        res.status(403).json({ error: "Already checked out" });
        break;
    }

    const updatedBooking = await db
      .update(booking)
      .set({ checkouttime: currentTime.toISOString(), currentstatus: "completed"})
      .where(
        and(
          lt(booking.starttime, currentTime.toISOString()),
          gt(booking.endtime, currentTime.toISOString()),
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user),
          eq(booking.currentstatus, "checkedin"))
          )
      .returning();

    if (updatedBooking.length != 1) {
      res.status(500).json({ error: "Booking modified during operation" });
      return;
    }

    res.json({});
  } catch (error) {
    res.status(204);
  }
}

export async function editBooking(
  req: TypedRequest<Booking>,
  res: TypedResponse<{ booking: Booking }>,
) {
  try {
    if (!typia.is<Booking>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const bookingExists = await db
    .select()
    .from(booking)
    .where(eq(booking.id, req.body.id));

    if (bookingExists.length != 1) {
      res.status(404).json({ error: "Booking ID does not exist" });
      return;
    }

    // check that the updated booking is valid

    const updatedBooking = await db
      .update(booking)
      .set({
        id: req.body.id,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        spaceid: req.body.spaceid,
        currentstatus: "pending",
        description: req.body.description
       })
      .where(
        and(
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user)
        )
      )
      .returning();

    if (updatedBooking.length != 1) {
      res.status(500).json({ error: "Booking modified during operation" });
      return;
    }

    // Send confirmation email with new booking details

    res.json({ booking: updatedBooking[0] });
  } catch (error) {
    res.status(204);
  }
}
