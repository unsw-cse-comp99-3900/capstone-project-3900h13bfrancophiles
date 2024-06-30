import { Booking, AnonymousBooking } from './types';

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

export function anonymiseBooking(booking: Booking): AnonymousBooking {
  return {
    id: booking.id,
    starttime: booking.starttime,
    endtime: booking.endtime,
    spaceid: booking.spaceid,
    currentstatus: booking.currentstatus
  };
}
