import { booking, space } from "../../drizzle/schema";
import { and, gt, inArray, lt } from "drizzle-orm";
import typia from "typia";

import { db } from "../index";
import { Booking, IDatetimeRange, TypedGETRequest, TypedResponse } from "../types";
import { formatBookingDates } from "../utils";

type Status = { status: "Available" } | { status: "Unavailable"; booking: Booking };

type StatusResponse = {
  [spaceId: string]: Status;
};

/**
 * Determines the availability status of all spaces within a specified datetime range.
 *
 * @param {TypedGETRequest} req - The request object containing query parameters for datetimeStart and datetimeEnd.
 * @param {TypedResponse<StatusResponse>} res - The response object containing the availability status of each space.
 */
export async function spaceStatus(req: TypedGETRequest, res: TypedResponse<StatusResponse>) {
  try {
    const parsedQuery = typia.http.isQuery<IDatetimeRange>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const datetimeStart = parsedQuery.datetimeStart;
    const datetimeEnd = parsedQuery.datetimeEnd;

    const spaceIds = await db.select({ id: space.id }).from(space);

    const overlappingBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          lt(booking.starttime, datetimeEnd),
          gt(booking.endtime, datetimeStart),
          inArray(booking.currentstatus, ["confirmed", "checkedin"]),
        ),
      )
      .orderBy(booking.starttime);

    // Mark all spaces with bookings as unavailable
    const result: StatusResponse = {};
    for (const booking of overlappingBookings) {
      if (booking.spaceid in result) continue;
      result[booking.spaceid] = {
        status: "Unavailable",
        booking: formatBookingDates(booking),
      };
    }

    // Mark the remaining as available
    for (const { id } of spaceIds) {
      if (id in result) continue;
      result[id] = { status: "Available" };
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}
