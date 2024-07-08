import { Booking, AnonymousBooking, BookingStatus, USER_GROUPS, UserGroup } from './types';
import { space } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { db } from './index';

/**
 * Format the booking dates by adding a Z to the end to signify UTC time. It
 * modifies the booking in-place.
 *
 * This is necessary because our database stores time in UTC but does not
 * store the timezone, so the frontend interprets the returned dates as local
 * time.
 */
export function formatBookingDates(booking: Booking) {
  booking.starttime += 'Z';
  booking.endtime += 'Z';
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
  spaceId: string
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
    starttime: booking.starttime,
    endtime: booking.endtime,
    spaceid: booking.spaceid,
    currentstatus: booking.currentstatus,
    checkintime: booking.checkintime,
    checkouttime: booking.checkouttime
  };
}
