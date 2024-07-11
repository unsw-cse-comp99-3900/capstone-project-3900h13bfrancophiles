import { Booking, IDatetimeRange, TypedGETRequest, TypedResponse } from '../types';
import typia from 'typia';
import { db } from '../index';
import { booking, space } from '../../drizzle/schema';
import { and, gte, lte } from 'drizzle-orm';
import { formatBookingDates } from '../utils';

type Status = { status: "Available" }
            | { status: "Unavailable", booking: Booking };

type StatusResponse = {
  [spaceId: string]: Status;
}

export async function spaceStatus(
  req: TypedGETRequest<{ datetimeStart: string, datetimeEnd: string }>,
  res: TypedResponse<StatusResponse>,
) {
  try {
    if (!typia.is<IDatetimeRange>(req.query)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const datetimeStart = req.query.datetimeStart;
    const datetimeEnd = req.query.datetimeEnd;

    const spaceIds = await db
      .select({ id: space.id })
      .from(space);

    const overlappingBookings = await db
      .select()
      .from(booking)
      .where(and(
        lte(booking.starttime, datetimeEnd),
        gte(booking.endtime, datetimeStart),
      ))
      .orderBy(booking.starttime);

    // Mark all spaces with bookings as unavailable
    const result: StatusResponse = {};
    for (const booking of overlappingBookings) {
      if (booking.spaceid in result) continue;
      result[booking.spaceid] = {
        status: "Unavailable",
        booking: formatBookingDates(booking)
      };
    }

    // Mark the remaining as available
    for (const { id } of spaceIds) {
      if (id in result) continue;
      result[id] = { status: "Available" };
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
