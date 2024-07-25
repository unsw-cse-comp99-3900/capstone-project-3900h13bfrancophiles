import typia, { tags } from 'typia';
import { Booking, TypedGETRequest, TypedRequest, TypedResponse } from '../types';
import { db } from '../index';
import { booking } from '../../drizzle/schema';
import { and, asc, count, desc, eq, gt, lt } from 'drizzle-orm';

import { sendBookingEmail } from '../email/service';
import { BOOKING_DECLINE, BOOKING_APPROVE } from '../email/template';
import { formatBookingDates, now } from '../utils';

interface PendingBookingsRequest {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  sort: 'soonest' | 'latest';
}

export async function pendingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[]; total: number }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<PendingBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: 'Invalid input' });
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
        .where(and(gt(booking.starttime, currentTime), eq(booking.currentstatus, 'pending')));

      const pendingBookings = await trx
        .select()
        .from(booking)
        .where(and(gt(booking.starttime, currentTime), eq(booking.currentstatus, 'pending')))
        .orderBy(parsedQuery.sort == 'soonest' ? desc(booking.starttime) : asc(booking.starttime))
        .limit(limit)
        .offset(offset);

      res.json({
        bookings: pendingBookings.map(formatBookingDates),
        total: pendingBookingsTotal[0].count,
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending bookings' });
  }
}

export async function approveBooking(req: TypedRequest<{ id: number }>, res: TypedResponse<{}>) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    await db.transaction(async (trx) => {
      const updatedBooking = await trx
        .update(booking)
        .set({ currentstatus: 'confirmed' })
        .where(eq(booking.id, req.body.id))
        .returning();

      if (updatedBooking.length != 1) {
        throw new Error('Booking ID does not exist');
      }

      const updatedBookingDetails = updatedBooking[0];

      // Decline overlapping bookings and get the updated records
      const declinedBookings = await trx
        .update(booking)
        .set({ currentstatus: 'declined' })
        .where(
          and(
            eq(booking.currentstatus, 'pending'),
            eq(booking.spaceid, updatedBookingDetails.spaceid),
            and(
              lt(booking.starttime, updatedBookingDetails.endtime),
              gt(booking.endtime, updatedBookingDetails.starttime),
            ),
          ),
        )
        .returning();

      // Notify users about declined overlapping bookings
      const formattedDeclinedBookings = declinedBookings.map(formatBookingDates);
      for (const declinedBooking of formattedDeclinedBookings) {
        sendBookingEmail(req.token.user, declinedBooking, BOOKING_DECLINE);
      }

      const formattedBooking = formatBookingDates(updatedBookingDetails);
      sendBookingEmail(req.token.user, formattedBooking, BOOKING_APPROVE);

    });

    res.status(200).json({ message: 'Booking approved and overlapping bookings declined' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function declineBooking(req: TypedRequest<{ id: number }>, res: TypedResponse<{}>) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const updatedBooking = await db
      .update(booking)
      .set({ currentstatus: 'declined' })
      .where(eq(booking.id, req.body.id))
      .returning();

    if (updatedBooking.length != 1) {
      throw new Error('Booking modified during operation');
    }

    const formattedBooking = formatBookingDates(updatedBooking[0]);
    await sendBookingEmail(req.token.user, formattedBooking, BOOKING_DECLINE);
    res.status(200).json({ message: 'Booking declined' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function overlappingBookings(
  req: TypedRequest<{ id: number }>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    if (!typia.is<{ id: number }>(req.body)) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    await db.transaction(async (trx) => {
      const updatedBooking = await trx.select().from(booking).where(eq(booking.id, req.body.id));

      if (updatedBooking.length != 1) {
        throw new Error('Booking ID does not exist');
      }

      const updatedBookingDetails = updatedBooking[0];

      const overlapping = await trx
        .select()
        .from(booking)
        .where(
          and(
            eq(booking.currentstatus, 'pending'),
            eq(booking.spaceid, updatedBookingDetails.spaceid),
            and(
              lt(booking.starttime, updatedBookingDetails.endtime),
              gt(booking.endtime, updatedBookingDetails.starttime),
            ),
          ),
        );

      res.json({
        bookings: overlapping,
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
