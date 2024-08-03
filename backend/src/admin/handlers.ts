import typia, { tags } from "typia";
import { Booking, TypedGETRequest, TypedRequest, TypedResponse } from "../types";
import { db } from "../index";
import { booking } from "../../drizzle/schema";
import { and, asc, count, desc, eq, gt, lt, ne } from "drizzle-orm";

import { sendBookingEmail } from "../email/service";
import { BOOKING_APPROVE, BOOKING_DECLINE } from "../email/template";
import { declineOverlapping, formatBookingDates, now } from "../utils";

interface PendingBookingsRequest {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  sort: "soonest" | "latest";
}

/**
 * Fetches pending bookings with pagination and sorting.
 *
 * @param {TypedGETRequest} req - The GET request containing query parameters.
 * @param {TypedResponse<{ bookings: Booking[]; total: number }>} res - The response object to send back the bookings and total count.
 */
export async function pendingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[]; total: number }>,
) {
  const parsedQuery = typia.http.isQuery<PendingBookingsRequest>(new URLSearchParams(req.query));
  if (!parsedQuery) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const page = parsedQuery.page;
  const limit = parsedQuery.limit;
  const offset = (page - 1) * limit;
  const currentTime = (await now()).toISOString();

  await db.transaction(async (trx) => {
    const pendingBookingsTotal = await trx
      .select({ count: count() })
      .from(booking)
      .where(and(gt(booking.starttime, currentTime), eq(booking.currentstatus, "pending")));

    const pendingBookings = await trx
      .select()
      .from(booking)
      .where(and(gt(booking.starttime, currentTime), eq(booking.currentstatus, "pending")))
      .orderBy(parsedQuery.sort == "soonest" ? asc(booking.starttime) : desc(booking.starttime))
      .limit(limit)
      .offset(offset);

    res.json({
      bookings: pendingBookings.map(formatBookingDates),
      total: pendingBookingsTotal[0].count,
    });
  });
}

/**
 * Approves a booking and declines any overlapping bookings.
 *
 * @param {TypedRequest<{ id: number }>} req - The request containing the booking ID to approve.
 * @param {TypedResponse<object>} res - The response object to send back the approval status.
 */
export async function approveBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<object>,
) {
  if (!typia.is<{ id: number }>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  await db.transaction(async (trx) => {
    const updatedBooking = await trx.select().from(booking).where(eq(booking.id, req.body.id));

    if (updatedBooking.length != 1) {
      throw new Error("Booking ID does not exist");
    }

    const updatedBookingDetails = updatedBooking[0];
    await declineOverlapping(
      trx,
      updatedBookingDetails.spaceid,
      updatedBookingDetails.starttime,
      updatedBookingDetails.endtime,
      updatedBookingDetails.id,
    );

    if (updatedBookingDetails.parent !== null) {
      // Delete parent booking
      await trx
        .update(booking)
        .set({ currentstatus: "deleted" })
        .where(eq(booking.id, updatedBookingDetails.parent));
    }

    const approvedBooking = await trx
      .update(booking)
      .set({ currentstatus: "confirmed", parent: null })
      .where(eq(booking.id, req.body.id))
      .returning();

    const approvedBookingDetails = approvedBooking[0];

    const formattedBooking = formatBookingDates(approvedBookingDetails);
    await sendBookingEmail(approvedBookingDetails.zid, formattedBooking, BOOKING_APPROVE);
  });
  res.status(200).json({ message: "Booking approved and overlapping bookings declined" });
}

/**
 * Declines a booking and sends a notification email.
 *
 * @param {TypedRequest<{ id: number }>} req - The request containing the booking ID to decline.
 * @param {TypedResponse<object>} res - The response object to send back the decline status.
 */
export async function declineBooking(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<object>,
) {
  if (!typia.is<{ id: number }>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const updatedBooking = await db
    .update(booking)
    .set({ currentstatus: "declined" })
    .where(eq(booking.id, req.body.id))
    .returning();

  if (updatedBooking.length != 1) {
    throw new Error("Booking modified during operation");
  }

  const formattedBooking = formatBookingDates(updatedBooking[0]);
  await sendBookingEmail(formattedBooking.zid, formattedBooking, BOOKING_DECLINE);
  res.status(200).json({ message: "Booking declined" });
}

/**
 * Fetches bookings that overlap with a given booking ID.
 *
 * @param {TypedGETRequest} req - The GET request containing the booking ID.
 * @param {TypedResponse<{ bookings: Booking[] }>} res - The response object to send back the overlapping bookings.
 */
export async function overlappingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  const bookingId = Number(req.params.bookingId);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  await db.transaction(async (trx) => {
    const updatedBooking = await trx.select().from(booking).where(eq(booking.id, bookingId));

    if (updatedBooking.length != 1) {
      throw new Error("Booking ID does not exist");
    }

    const updatedBookingDetails = updatedBooking[0];

    const overlapping = await trx
      .select()
      .from(booking)
      .where(
        and(
          eq(booking.currentstatus, "pending"),
          eq(booking.spaceid, updatedBookingDetails.spaceid),
          ne(booking.id, updatedBookingDetails.id),
          lt(booking.starttime, updatedBookingDetails.endtime),
          gt(booking.endtime, updatedBookingDetails.starttime),
        ),
      );

    res.json({
      bookings: overlapping.map(formatBookingDates),
    });
  });
}
