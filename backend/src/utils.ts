import { buffer } from 'stream/consumers';
import { Booking } from './types';

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

  if (start <= current && current <= end) {
    return true;
  }
  return false;
}
