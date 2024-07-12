// Booking endpoint handlers

import { db } from '../index'
import {and, count, desc, eq, gt, gte, inArray, lt, lte} from "drizzle-orm"
import {booking, hotdesk, room} from '../../drizzle/schema';
import {
  Booking,
  BookingDetailsRequest,
  BookingEditRequest,
  IDatetimeRange,
  TypedGETRequest,
  TypedRequest,
  TypedResponse
} from '../types';
import typia, { tags } from "typia";
import isEqual from 'lodash/isEqual';
import { formatBookingDates, initialBookingStatus, withinDateRange as dateInRange } from '../utils';

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

type UpcomingBookingsRequest = {
  type: string;
}

export async function upcomingBookings(
  req: TypedGETRequest<UpcomingBookingsRequest>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    if (!['rooms', 'all', 'desks'].includes(req.query.type)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = req.token.user;
    const currentTime = new Date().toISOString();

    let subQuery;

    switch (req.query.type) {
      case 'desks':
        subQuery = db.select({id: hotdesk.id}).from(hotdesk)
        break;
      case 'rooms':
        subQuery = db.select({id: room.id}).from(room)
        break;
      default:
        subQuery = db.select({id: booking.spaceid}).from(booking)
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
      );

    res.json({ bookings: upcomingBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming bookings' });
  }
}

interface IPagination {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  type: 'desks' | 'rooms' | 'all'
}

type PastBookingsRequest = {
  page: string;
  limit: string;
  type: string;
}

export async function pastBookings(
  req: TypedGETRequest<PastBookingsRequest>,
  res: TypedResponse<{ bookings: Booking[];  total: number }>,
) {
  try {
    if (!typia.is<IPagination>({ page: parseInt(req.query.page), limit: parseInt(req.query.limit), type: req.query.type })) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    const currentTime = new Date().toISOString();

    let subQuery;

    switch (req.query.type) {
      case 'desks':
        subQuery = db.select({id: hotdesk.id}).from(hotdesk)
        break;
      case 'rooms':
        subQuery = db.select({id: room.id}).from(room)
        break;
      default:
        subQuery = db.select({id: booking.spaceid}).from(booking)
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
      .orderBy(desc(booking.starttime))
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

    const currentBookings = await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.zid, req.token.user),
        eq(booking.id, req.body.id)
      )
    );

    if (currentBookings.length != 1) {
      res.status(403).json({ error: "Booking id does not exist for this user" });
      return;
    }

    const currentBooking = formatBookingDates(currentBookings[0]);

    // 5 minute buffer value too long?
    if (!dateInRange(currentTime, new Date(currentBooking.starttime), new Date(currentBooking.endtime), 5)) {
      console.log(currentTime);
      console.log(currentBooking.starttime);
      console.log(currentBooking.endtime);
      res.status(403).json({ error: "Outside booking time window" });
      return;
    }

    switch (currentBooking.currentstatus) {
      case 'pending':
        res.status(403).json({ error: "Booking not yet confirmed" });
        return;
      case 'checkedin':
        res.status(403).json({ error: "Already checked in" });
        return;
      case 'completed':
        res.status(403).json({ error: "Already checked out" });
        return;
    }


    let updatedBooking: Booking;
    try {
      const res = await db
      .update(booking)
      .set({ checkintime: currentTime.toISOString(), currentstatus: "checkedin" })
      .where(
        and(
          lt(booking.starttime, currentTime.toISOString()),
          gt(booking.endtime, currentTime.toISOString()),
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user)))
      .returning();

      updatedBooking = formatBookingDates(res[0]);

    } catch (e: any) {
      res.status(400).json({ error: `${e}` });
      return;
    }

    // If prior booking in this space didn't check out, update their checkout time now?

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
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

export async function createBooking(
  req: TypedRequest<BookingDetailsRequest>,
  res: TypedResponse<{ booking: Booking }>,
) {
  if (!typia.is<BookingDetailsRequest>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const status = await initialBookingStatus(req.token.group, req.body.spaceid);
  if (status === undefined) {
    res.status(404).json({ error: `Space ${req.body.spaceid} not found` });
    return;
  }
  if (status === null) {
    res.status(403).json({ error: "You do not have permission to book this space" });
    return;
  }

  let createdBooking: Booking;
  try {
    const res = await db
      .insert(booking)
      .values({
        zid: req.token.user,
        currentstatus: status,
        ...req.body
      })
      .returning();

    createdBooking = formatBookingDates(res[0]);
  } catch (e: any) {
    res.status(400).json({ error: `${e}` });
    return;
  }

  res.json({ booking: createdBooking });
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

    const bookingExists = await db
      .select()
      .from(booking)
      .where(eq(booking.id, req.body.id));

    if (bookingExists.length != 1) {
      res.status(404).json({ error: "Booking ID does not exist" });
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
      res.status(403).json({ error: "User does not own this booking ID" });
      return;
    }

    // TODO: send an email to the user confirming deletion
    // email.deletionConfirmation(req.token.user, deletedBooking[0])

    res.json({});
  } catch (error) {
    res.status(204);
  }
}


export async function editBooking(
  req: TypedRequest<BookingEditRequest>,
  res: TypedResponse<{ booking: Booking }>,
) {
  try {
    if (!typia.is<BookingEditRequest>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const existingBooking = await db
      .select()
      .from(booking)
      .where(
        and(
          eq(booking.id, req.body.id),
          eq(booking.zid, req.token.user)
        )
      );

    if (existingBooking.length != 1) {
      res.status(404).json({ error: "User does not have a booking with this id" });
      return;
    }

    const editedBooking = { ...existingBooking[0], ...req.body };

    if (isEqual(editedBooking, existingBooking[0])) {
      res.json({ booking: formatBookingDates(editedBooking) });
      return;
    }

    const newBookingStatus = await initialBookingStatus(req.token.group, editedBooking.spaceid);
    if (newBookingStatus === undefined) {
      res.status(404).json({ error: `Space ${existingBooking[0].spaceid} not found` });
      return;
    }
    if (newBookingStatus === null) {
      res.status(403).json({ error: "You do not have permission to book this space" });
      return;
    }

    let formattedBooking: Booking;
    try {
      const res = await db
        .update(booking)
        .set({
          starttime: editedBooking.starttime,
          endtime: editedBooking.endtime,
          spaceid: editedBooking.spaceid,
          currentstatus: newBookingStatus,
          description: editedBooking.description
        })
        .where(
          and(
            eq(booking.id, req.body.id),
            eq(booking.zid, req.token.user)
          )
        )
        .returning();

      formattedBooking = formatBookingDates(res[0]);
    } catch (e: any) {
      res.status(400).json({ error: `${e}` });
      return;
    }

    // TODO: send an email to the user confirming new booking details
    // email.editConfirmation(req.token.user, updatedBooking[0])

    // TODO: trigger admin reapproval if newStatus is pending

    res.json({ booking: formattedBooking });

  } catch (error) {
    res.status(204);
  }
}
