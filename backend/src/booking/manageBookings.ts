// Booking endpoint handlers

import { db } from '../index'
import { and, eq, gt, lt } from "drizzle-orm"
import { booking } from '../../drizzle/schema';
import { Booking, BookingDetailsRequest, BookingEdit, TypedRequest, TypedResponse } from '../types';
import typia from "typia";
import isEqual from 'lodash/isEqual';
import { formatBookingDates, initialBookingStatus, withinDateRange as dateInRange } from '../utils';

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
        return;
      case 'checkedin':
        res.status(403).json({ error: "Already checked in" });
        return;
      case 'completed':
        res.status(403).json({ error: "Already checked out" });
        return;
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
        return;
      case 'confirmed':
        res.status(403).json({ error: "Not yet checked in" });
        return;
      case 'completed':
        res.status(403).json({ error: "Already checked out" });
        return;
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
    res.status(500);
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
    res.status(500);
  }
}


export async function editBooking(
  req: TypedRequest<BookingEdit>,
  res: TypedResponse<{ booking: Booking }>,
) {
  try {
    if (!typia.is<BookingEdit>(req.body)) {
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