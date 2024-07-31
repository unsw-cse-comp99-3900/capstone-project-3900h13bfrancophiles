import { space, config, booking } from "../drizzle/schema";
import { and, eq, gt, lt, ne } from "drizzle-orm";

import { db } from "./index";
import { AnonymousBooking, Booking, BookingStatus, USER_GROUPS, UserGroup } from "./types";
import { sendBookingEmail } from "./email/service";
import { BOOKING_DECLINE } from "./email/template";

/**
 * Format the booking dates by adding a Z to the end to signify UTC time. It
 * modifies the booking in-place.
 *
 * This is necessary because our database stores time in UTC but does not
 * store the timezone, so the frontend interprets the returned dates as local
 * time.
 */
export function formatBookingDates(booking: Booking) {
  booking.starttime = new Date(booking.starttime + "Z").toISOString();
  booking.endtime = new Date(booking.endtime + "Z").toISOString();
  booking.created = new Date(booking.created + "Z").toISOString();
  booking.modified = new Date(booking.modified + "Z").toISOString();
  return booking;
}

/**
 * Determine whether a Date is within specified range, with given buffer in minutes
 */
export function withinDateRange(current: Date, start: Date, end: Date, bufferMinutes: number = 0) {
  start.setMinutes(start.getMinutes() - bufferMinutes);
  end.setMinutes(end.getMinutes() + bufferMinutes);

  return start <= current && current <= end;
}

/**
 * Return whether the initial status of a booking should be pending or confirmed.
 * Returns undefined if the space does not exist, returns null if the user
 * does not have permission to book the space.
 */
export async function initialBookingStatus(
  userGroup: UserGroup,
  spaceId: string,
): Promise<BookingStatus | null | undefined> {
  const res = await db
    .select({ minReqGrp: space.minreqgrp, minBookGrp: space.minbookgrp })
    .from(space)
    .where(eq(space.id, spaceId));
  if (res.length === 0) return undefined;

  const userGrpIdx = USER_GROUPS.indexOf(userGroup);
  const minReqIdx = USER_GROUPS.indexOf(res[0].minReqGrp);
  const minBookIdx = USER_GROUPS.indexOf(res[0].minBookGrp);
  if (userGrpIdx < minReqIdx) {
    return null;
  } else if (userGrpIdx < minBookIdx) {
    return "pending";
  } else {
    return "confirmed";
  }
}

export function anonymiseBooking(booking: Booking): AnonymousBooking {
  return {
    id: booking.id,
    zid: booking.zid,
    starttime: booking.starttime,
    endtime: booking.endtime,
    spaceid: booking.spaceid,
    currentstatus: booking.currentstatus,
    checkintime: booking.checkintime,
    checkouttime: booking.checkouttime,
    created: booking.created,
    modified: booking.modified,
  };
}

/**
 * Utility function to get the current time, which may be mocked for testing
 */
export async function now(): Promise<Date> {
  if (process.env.NODE_ENV === "test") {
    const res = await db
      .select({ currentTime: config.value })
      .from(config)
      .where(eq(config.key, "current_timestamp"));

    const currentTime = res?.[0].currentTime;
    return currentTime ? new Date(currentTime) : new Date();
  } else {
    return new Date();
  }
}

/**
 * Before a booking is confirmed (by edit, approval, or create), overlapping pending bookings
 * must be declined
 */
export async function declineOverlapping(
  tx: typeof db,
  spaceId: string,
  startTime: string,
  endTime: string,
  updatedBookingId?: number,
) {
  // Decline overlapping bookings and get the updated records
  const declinedBookings = await tx
    .update(booking)
    .set({ currentstatus: "declined" })
    .where(
      and(
        eq(booking.currentstatus, "pending"),
        eq(booking.spaceid, spaceId),
        lt(booking.starttime, endTime),
        gt(booking.endtime, startTime),
        ...(updatedBookingId ? [ne(booking.id, updatedBookingId)] : []),
      ),
    )
    .returning();

  // Notify users about declined overlapping bookings
  const formattedDeclinedBookings = declinedBookings.map(formatBookingDates);
  for (const declinedBooking of formattedDeclinedBookings) {
    await sendBookingEmail(declinedBooking.zid, declinedBooking, BOOKING_DECLINE);
  }
}
