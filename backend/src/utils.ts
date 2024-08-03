import { space, config, booking } from "../drizzle/schema";
import { and, eq, gt, lt, ne } from "drizzle-orm";

import { db } from "./index";
import { AnonymousBooking, Booking, BookingStatus, USER_GROUPS, UserGroup } from "./types";
import { sendBookingEmail } from "./email/service";
import { BOOKING_DECLINE } from "./email/template";

/**
 * Formats the booking dates by appending a 'Z' to signify UTC time.
 *
 * This function modifies the booking object in place. The dates are converted
 * to ISO strings with 'Z' to ensure they are interpreted as UTC time, as the
 * database stores time in UTC but does not include timezone information.
 *
 * @param booking - The booking object to format.
 * @returns The updated booking object with formatted dates.
 */
export function formatBookingDates(booking: Booking) {
  booking.starttime = new Date(booking.starttime + "Z").toISOString();
  booking.endtime = new Date(booking.endtime + "Z").toISOString();
  booking.created = new Date(booking.created + "Z").toISOString();
  booking.modified = new Date(booking.modified + "Z").toISOString();
  return booking;
}

/**
 * Checks if a given date is within a specified range, with an optional buffer.
 *
 * The function considers a date within the range if it falls between the start
 * and end dates, taking into account an optional buffer in minutes.
 *
 * @param current - The current date to check.
 * @param start - The start of the date range.
 * @param end - The end of the date range.
 * @param bufferMinutes - The number of minutes to extend the range on both sides (default is 0).
 * @returns True if the current date is within the adjusted range, false otherwise.
 */
export function withinDateRange(current: Date, start: Date, end: Date, bufferMinutes: number = 0) {
  start.setMinutes(start.getMinutes() - bufferMinutes);
  end.setMinutes(end.getMinutes() + bufferMinutes);

  return start <= current && current <= end;
}

/**
 * Determines the initial booking status based on user group and space requirements.
 *
 * Returns:
 * - `null` if the user does not have permission to book the space.
 * - `"pending"` if the user has the minimum required group but does not meet the booking group requirement.
 * - `"confirmed"` if the user meets or exceeds the booking group requirement.
 * - `undefined` if the space does not exist.
 *
 * @param userGroup - The user group of the individual making the booking.
 * @param spaceId - The ID of the space being booked.
 * @returns The initial booking status or null/undefined.
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

/**
 * Converts a booking object into an anonymised format.
 *
 * The anonymised format excludes personal information but retains key booking details.
 *
 * @param booking - The booking object to anonymise.
 * @returns The anonymised booking object.
 */
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
 * Retrieves the current time. In a test environment, it may return a mocked time.
 *
 * In non-test environments, it returns the current system time.
 *
 * @returns The current date and time.
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
 * Declines overlapping pending bookings for a given space and time range.
 *
 * Updates the status of conflicting bookings to "declined" and sends notification emails
 * to users about these declines. The optional `updatedBookingId` parameter excludes a
 * specific booking from being declined.
 *
 * @param tx - The database transaction object.
 * @param spaceId - The ID of the space where bookings need to be declined.
 * @param startTime - The start time of the booking to check against.
 * @param endTime - The end time of the booking to check against.
 * @param updatedBookingId - Optional ID of a booking to exclude from decline.
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
