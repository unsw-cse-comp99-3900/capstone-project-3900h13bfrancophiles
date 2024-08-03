import { booking, hotdesk, room } from "../../drizzle/schema";
import { and, asc, count, desc, eq, gt, gte, inArray, lt, lte, ne, or } from "drizzle-orm";
import typia, { tags } from "typia";

import { db } from "../index";
import { Booking, IDatetimeRange, TypedGETRequest, TypedResponse } from "../types";
import { formatBookingDates, now } from "../utils";

interface UpcomingBookingsRequest {
  type: "desks" | "rooms" | "all";
  sort: "soonest" | "latest";
}

interface PastBookingsRequest {
  page: number & tags.Minimum<1>;
  limit: number & tags.Minimum<1>;
  type: "desks" | "rooms" | "all";
  sort: "newest" | "oldest";
}

/**
 * Fetches the current bookings for the logged-in user.
 *
 * @param {TypedGETRequest} req - The typed GET request containing the user's token.
 * @param {TypedResponse<{ bookings: Booking[] }>} res - The typed response containing an array of current bookings.
 */
export async function currentBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const zid = req.token.user;
    const currentTime = (await now()).toISOString();

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          lt(booking.starttime, currentTime),
          gt(booking.endtime, currentTime),
          eq(booking.zid, zid),
          inArray(booking.currentstatus, ["confirmed", "checkedin"]),
        ),
      );

    res.json({ bookings: currentBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch current bookings" });
  }
}

/**
 * Fetches the upcoming bookings for the logged-in user.
 *
 * @param {TypedGETRequest} req - The typed GET request containing the user's token and query parameters.
 * @param {TypedResponse<{ bookings: Booking[] }>} res - The typed response containing an array of upcoming bookings.
 */
export async function upcomingBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const parsedQuery = typia.http.query<UpcomingBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const currentTime = (await now()).toISOString();

    let subQuery;
    switch (parsedQuery.type) {
      case "desks":
        subQuery = db.select({ id: hotdesk.id }).from(hotdesk);
        break;
      case "rooms":
        subQuery = db.select({ id: room.id }).from(room);
        break;
      default:
        subQuery = db.select({ id: booking.spaceid }).from(booking);
    }

    const upcomingBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          inArray(booking.spaceid, subQuery),
          gt(booking.starttime, currentTime),
          eq(booking.zid, zid),
          ne(booking.currentstatus, "deleted"),
        ),
      )
      .orderBy(parsedQuery.sort == "soonest" ? asc(booking.starttime) : desc(booking.starttime));

    res.json({ bookings: upcomingBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming bookings" });
  }
}

/**
 * Determines if a booking is considered a past booking based on the current time.
 *
 * @param {string} currentTime - The current time as a string.
 * @returns {boolean} A boolean that indicates if a booking is a past booking.
 */
function isPastBooking(currentTime: string) {
  return or(
    eq(booking.currentstatus, "completed"),
    and(
      lte(booking.endtime, currentTime),
      or(eq(booking.currentstatus, "confirmed"), eq(booking.currentstatus, "checkedin")),
    ),
  );
}

/**
 * Fetches the past bookings for the logged-in user.
 *
 * @param {TypedGETRequest} req - The typed GET request containing the user's token and query parameters.
 * @param {TypedResponse<{ bookings: Booking[]; total: number }>} res - The typed response containing an array of past bookings and the total number of past bookings.
 */
export async function pastBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[]; total: number }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<PastBookingsRequest>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const page = parsedQuery.page;
    const limit = parsedQuery.limit;
    const offset = (page - 1) * limit;
    const currentTime = (await now()).toISOString();

    let subQuery;
    switch (parsedQuery.type) {
      case "desks":
        subQuery = db.select({ id: hotdesk.id }).from(hotdesk);
        break;
      case "rooms":
        subQuery = db.select({ id: room.id }).from(room);
        break;
      default:
        subQuery = db.select({ id: booking.spaceid }).from(booking);
    }

    const totalBookings = await db
      .select({ count: count() })
      .from(booking)
      .where(
        and(inArray(booking.spaceid, subQuery), eq(booking.zid, zid), isPastBooking(currentTime)),
      );

    const pastBookings = await db
      .select()
      .from(booking)
      .where(
        and(inArray(booking.spaceid, subQuery), eq(booking.zid, zid), isPastBooking(currentTime)),
      )
      .orderBy(parsedQuery.sort == "newest" ? desc(booking.starttime) : asc(booking.starttime))
      .limit(limit)
      .offset(offset);

    res.json({
      bookings: pastBookings.map(formatBookingDates),
      total: totalBookings[0].count,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch past bookings" });
  }
}

/**
 * Fetches the bookings for the logged-in user within a specified date and time range.
 *
 * @param {TypedGETRequest} req - The typed GET request containing the user's token and query parameters.
 * @param {TypedResponse<{ bookings: Booking[] }>} res - The typed response containing an array of bookings within the specified range.
 */
export async function rangeOfBookings(
  req: TypedGETRequest,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<IDatetimeRange>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const zid = req.token.user;
    const datetimeStart = parsedQuery.datetimeStart;
    const datetimeEnd = parsedQuery.datetimeEnd;

    const currentBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          lte(booking.starttime, datetimeEnd),
          gte(booking.endtime, datetimeStart),
          eq(booking.zid, zid),
          ne(booking.currentstatus, "deleted"),
        ),
      );

    res.json({ bookings: currentBookings.map(formatBookingDates) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
