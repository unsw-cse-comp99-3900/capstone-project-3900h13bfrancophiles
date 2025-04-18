import { and, eq, or } from "drizzle-orm";
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
  declineOverlapping,
  formatBookingDates,
  initialBookingStatus,
  now,
  withinDateRange,
} from "../utils";

/**
 * Checks in a booking for a user.
 *
 * @param {TypedRequest<{ id: number }>} req - The request object containing the booking ID.
 * @param {TypedResponse<{ booking: Booking }>} res - The response object to return the checked-in booking.
 */
export async function checkInBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{ booking: Booking }>,
) {
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
}

/**
 * Checks out a booking for a user.
 *
 * @param {TypedRequest<{ id: number }>} req - The request object containing the booking ID.
 * @param {TypedResponse} res - The response object to return the status.
 */
export async function checkOutBooking(req: TypedRequest<{ id: number }>, res: TypedResponse) {
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
}

/**
 * Creates a new booking for a user.
 *
 * @param {TypedRequest<BookingDetailsRequest>} req - The request object containing the booking details.
 * @param {TypedResponse<{ booking: Booking }>} res - The response object to return the created booking.
 */
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

/**
 * Deletes an existing booking for a user.
 *
 * @param {TypedRequest<{ id: number }>} req - The request object containing the booking ID.
 * @param {TypedResponse<{ booking: Booking }>} res - The response object to return the deleted booking.
 */
export async function deleteBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  if (!typia.is<{ id: number }>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const bookingExists = await db.select().from(booking).where(eq(booking.id, req.body.id));

  if (bookingExists.length != 1) {
    res.status(404).json({ error: "Booking ID does not exist" });
    return;
  }

  const formattedBookings: Booking[] = [];
  try {
    // Delete booking and any child bookings
    const deleteBookings = await db
      .update(booking)
      .set({
        currentstatus: "deleted",
      })
      .where(
        and(
          or(eq(booking.id, req.body.id), eq(booking.parent, req.body.id)),
          eq(booking.zid, req.token.user),
        ),
      )
      .returning();

    await Promise.all(
      deleteBookings.map((booking) => {
        formattedBookings.push(formatBookingDates(booking));
        return sendBookingEmail(
          req.token.user,
          formattedBookings[formattedBookings.length - 1],
          BOOKING_DELETE,
        );
      }),
    );
  } catch (e) {
    res.status(400).json({ error: `${e}` });
    return;
  }

  res.json({ bookings: formattedBookings });
}

/**
 * Edits an existing booking for a user.
 *
 * @param {TypedRequest<BookingEditRequest>} req - The request object containing the booking edit details.
 * @param {TypedResponse<{ booking: Booking }>} res - The response object to return the edited booking.
 */
export async function editBooking(
  req: TypedRequest<BookingEditRequest>,
  res: TypedResponse<{ booking: Booking }>,
) {
  if (!typia.is<BookingEditRequest>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const childBookings = await db
    .select()
    .from(booking)
    .where(and(eq(booking.parent, req.body.id), eq(booking.zid, req.token.user)));

  // If the booking has a child, modify the child instead
  if (childBookings.length == 1) {
    req.body.id = childBookings[0].id;
  }

  const existingBooking = await db
    .select()
    .from(booking)
    .where(and(eq(booking.id, req.body.id), eq(booking.zid, req.token.user)));

  if (existingBooking.length != 1) {
    res.status(404).json({ error: "User does not have a booking with this id" });
    return;
  }

  if (
    !(
      existingBooking[0].currentstatus === "pending" ||
      existingBooking[0].currentstatus === "confirmed" ||
      existingBooking[0].currentstatus === "declined"
    )
  ) {
    res
      .status(404)
      .json({ error: `Cannot edit a booking with status ${existingBooking[0].currentstatus}` });
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

  try {
    const formattedBooking = await db.transaction(async (tx) => {
      // Decline Overlapping
      if (newBookingStatus === "confirmed") {
        await declineOverlapping(
          tx,
          editedBooking.spaceid,
          editedBooking.starttime,
          editedBooking.endtime,
          editedBooking.id,
        );
      }

      if (
        existingBooking[0].currentstatus === "pending" ||
        existingBooking[0].currentstatus === "declined" ||
        newBookingStatus === "confirmed"
      ) {
        // If booking is still pending/declined or new approval is not required, update the old booking in place
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

        return formatBookingDates(res[0]);
      } else {
        // If approval is required; create new booking request with original booking as parent
        editedBooking.parent = existingBooking[0].id;
        const res = await db
          .insert(booking)
          .values({
            zid: req.token.user,
            starttime: editedBooking.starttime,
            endtime: editedBooking.endtime,
            spaceid: editedBooking.spaceid,
            description: editedBooking.description,
            currentstatus: newBookingStatus,
            parent: existingBooking[0].id,
          })
          .returning();

        return formatBookingDates(res[0]);
      }
    });

    await sendBookingEmail(req.token.user, formattedBooking, BOOKING_EDIT);
    res.json({ booking: formattedBooking });
  } catch (e) {
    res.status(400).json({ error: `${e}` });
  }
}
