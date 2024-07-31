import { and, eq } from "drizzle-orm";
import { booking } from "../../drizzle/schema";
import isEqual from "lodash/isEqual";
import typia from "typia";

import { sendBookingEmail } from "../email/service";
import { BOOKING_DELETE, BOOKING_EDIT, BOOKING_REQUEST } from "../email/template";
import { db } from "../index";
import {
  Booking,
  BookingDetailsRequest,
  BookingEditRequest,
  TypedRequest,
  TypedResponse,
} from "../types";
import {
  formatBookingDates,
  initialBookingStatus,
  withinDateRange,
  now,
  declineOverlapping,
} from "../utils";

export async function checkInBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{ booking: Booking }>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const currentTime = await now();

    const currentBookings = await db
      .select()
      .from(booking)
      .where(and(eq(booking.zid, req.token.user), eq(booking.id, req.body.id)));

    if (currentBookings.length != 1) {
      res.status(404).json({ error: "Booking id does not exist for this user" });
      return;
    }

    const currentBooking = formatBookingDates(currentBookings[0]);

    // 5 minute buffer value too long?
    if (
      !withinDateRange(
        currentTime,
        new Date(currentBooking.starttime),
        new Date(currentBooking.endtime),
        5,
      )
    ) {
      res.status(400).json({ error: "Outside booking time window" });
      return;
    }

    switch (currentBooking.currentstatus) {
      case "pending":
        res.status(400).json({ error: "Booking not yet confirmed" });
        return;
      case "checkedin":
        res.status(400).json({ error: "Already checked in" });
        return;
      case "completed":
        res.status(400).json({ error: "Already checked out" });
        return;
    }

    let updatedBooking: Booking;
    try {
      const res = await db
        .update(booking)
        .set({ checkintime: currentTime.toISOString(), currentstatus: "checkedin" })
        .where(eq(booking.id, req.body.id))
        .returning();

      updatedBooking = formatBookingDates(res[0]);
    } catch (e) {
      res.status(400).json({ error: `${e}` });
      return;
    }

    // If prior booking in this space didn't check out, update their checkout time now?

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to check in" });
  }
}

export async function checkOutBooking(req: TypedRequest<{ id: number }>, res: TypedResponse) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const currentTime = await now();

    const currentBookings = await db
      .select()
      .from(booking)
      .where(and(eq(booking.zid, req.token.user), eq(booking.id, req.body.id)));

    if (currentBookings.length != 1) {
      res.status(404).json({ error: "Booking id does not exist for this user" });
      return;
    }

    const currentBooking = formatBookingDates(currentBookings[0]);

    // 5 minute buffer value too long?
    if (
      !withinDateRange(
        currentTime,
        new Date(currentBooking.starttime),
        new Date(currentBooking.endtime),
        5,
      )
    ) {
      res.status(400).json({ error: "Outside booking time window" });
      return;
    }

    switch (currentBooking.currentstatus) {
      case "pending":
        res.status(400).json({ error: "Booking not yet confirmed" });
        return;
      case "confirmed":
        res.status(400).json({ error: "Not yet checked in" });
        return;
      case "completed":
        res.status(400).json({ error: "Already checked out" });
        return;
    }

    const updatedBooking = await db
      .update(booking)
      .set({ checkouttime: currentTime.toISOString(), currentstatus: "completed" })
      .where(eq(booking.id, req.body.id))
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

  try {
    const createdBooking = await db.transaction(async (tx) => {
      if (status === "confirmed") {
        await declineOverlapping(tx, req.body.spaceid, req.body.starttime, req.body.endtime);
      }

      const res = await tx
        .insert(booking)
        .values({
          zid: req.token.user,
          currentstatus: status,
          ...req.body,
        })
        .returning();

      return formatBookingDates(res[0]);
    });

    await sendBookingEmail(req.token.user, createdBooking, BOOKING_REQUEST);
    res.json({ booking: createdBooking });
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
}

export async function deleteBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{ booking: Booking }>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const bookingExists = await db.select().from(booking).where(eq(booking.id, req.body.id));

    if (bookingExists.length != 1) {
      res.status(404).json({ error: "Booking ID does not exist" });
      return;
    }

    let formattedBooking: Booking;
    try {
      const res = await db
        .update(booking)
        .set({
          currentstatus: "deleted",
        })
        .where(and(eq(booking.id, req.body.id), eq(booking.zid, req.token.user)))
        .returning();

      formattedBooking = formatBookingDates(res[0]);
      await sendBookingEmail(req.token.user, formattedBooking, BOOKING_DELETE);
    } catch (e) {
      res.status(400).json({ error: `${e}` });
      return;
    }

    res.json({ booking: formattedBooking });
  } catch (error) {
    res.status(500);
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
      .where(and(eq(booking.id, req.body.id), eq(booking.zid, req.token.user)));

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
          description: editedBooking.description,
        })
        .where(and(eq(booking.id, req.body.id), eq(booking.zid, req.token.user)))
        .returning();

      formattedBooking = formatBookingDates(res[0]);
      // TODO: This email should show the old details, and the new details too...
      await sendBookingEmail(req.token.user, formattedBooking, BOOKING_EDIT);
    } catch (e) {
      res.status(400).json({ error: `${e}` });
      return;
    }

    // TODO: trigger admin reapproval if newStatus is pending

    res.json({ booking: formattedBooking });
  } catch (error) {
    res.status(204);
  }
}
