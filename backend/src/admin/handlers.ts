import {booking} from "../../drizzle/schema";
import { and, asc, count, desc, eq, gt } from "drizzle-orm";
import typia, { tags } from "typia";

import {db} from "../index";
import {
  Booking,
  TypedGETRequest,
  TypedResponse
} from "../types";
import { formatBookingDates, now } from "../utils";

interface PendingBookingsRequest {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  sort: 'soonest' | 'latest';
}

export async function pendingBookings (
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[]; total: number }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<PendingBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const page = parsedQuery.page;
    const limit = parsedQuery.limit;
    const offset = (page - 1) * limit;
    const currentTime = (await now()).toISOString();

    const pendingBookingsTotal = await db
      .select({ count: count() })
      .from(booking)
      .where(and(
        gt(booking.starttime, currentTime),
        eq(booking.currentstatus, 'pending')
      ));

    const pendingBookings = await db
      .select()
      .from(booking)
      .where(and(
        gt(booking.starttime, currentTime),
        eq(booking.currentstatus, 'pending')
      ))
      .orderBy(parsedQuery.sort == 'soonest' ? desc(booking.starttime) : asc(booking.starttime))
      .limit(limit)
      .offset(offset);

    res.json({
      bookings: pendingBookings.map(formatBookingDates),
      total: pendingBookingsTotal[0].count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending bookings' });
  }
}
