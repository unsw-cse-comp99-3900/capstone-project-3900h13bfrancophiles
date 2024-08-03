import { eq, and, asc, sql, lte, gte, inArray } from "drizzle-orm";
import { hotdesk, room, space, booking } from "../../drizzle/schema";
import { db } from "../index";
import {
  TypedGETRequest,
  TypedResponse,
  Room,
  Space,
  AnonymousBooking,
  SpaceType,
  UserGroup,
  USER_GROUPS,
  IDatetimeRange,
} from "../types";
import { anonymiseBooking, formatBookingDates, now } from "../utils";
import typia from "typia";

type canBookReq = { spaceId: string };
type SingleSpaceRequest = { spaceId: string };

/**
 * Fetches and returns the details of all rooms.
 *
 * @param {TypedGETRequest} _req - The request object.
 * @param {TypedResponse<{ rooms: Room[] }>} res - The response object containing the list of rooms.
 */
export async function roomDetails(_req: TypedGETRequest, res: TypedResponse<{ rooms: Room[] }>) {
  try {
    const rooms = await db
      .select({
        id: room.id,
        name: space.name,
        type: room.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
      })
      .from(room)
      .innerJoin(space, eq(space.id, room.id))
      .orderBy(room.id);

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

/**
 * Fetches and returns the details of a single space, either a room or a desk.
 *
 * @param {TypedGETRequest<SingleSpaceRequest>} req - The request object containing the space ID.
 * @param {TypedResponse<{ space: Space; type: SpaceType }>} res - The response object containing the space details and type.
 */
export async function singleSpaceDetails(
  req: TypedGETRequest<SingleSpaceRequest>,
  res: TypedResponse<{ space: Space; type: SpaceType }>,
) {
  try {
    // Try get it as a room
    const roomRes = await db
      .select({
        id: room.id,
        name: space.name,
        type: room.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
      })
      .from(room)
      .innerJoin(space, eq(space.id, room.id))
      .where(eq(room.id, req.params.spaceId));

    if (roomRes.length) {
      res.json({ space: roomRes[0], type: "room" });
      return;
    }

    // Try get it as a desk
    const deskRes = await db
      .select({
        id: hotdesk.id,
        name: space.name,
        floor: hotdesk.floor,
        xcoord: hotdesk.xcoord,
        ycoord: hotdesk.ycoord,
      })
      .from(hotdesk)
      .innerJoin(space, eq(space.id, hotdesk.id))
      .where(eq(hotdesk.id, req.params.spaceId));

    if (deskRes.length) {
      res.json({ space: deskRes[0], type: "desk" });
      return;
    }

    res.status(404).json({ error: `No space found with id "${req.params.spaceId}"` });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

/**
 * Fetches and returns the details of all spaces, indicating whether each space is a room.
 *
 * @param {TypedGETRequest} _req - The request object.
 * @param {TypedResponse<{ spaces: { id: string; name: string; isRoom: boolean }[] }>} res - The response object containing the list of spaces.
 */
export async function allSpaces(
  _req: TypedGETRequest,
  res: TypedResponse<{ spaces: { id: string; name: string; isRoom: boolean }[] }>,
) {
  const subquery = db.select({ data: room.id }).from(room);
  const spaces = await db
    .select({
      id: space.id,
      name: space.name,
      isRoom: sql<boolean>`${space.id} in (${subquery})`,
    })
    .from(space);

  res.json({ spaces });
}

/**
 * Fetches and returns the availability of bookings for a specific space within a given date range.
 *
 * @param {TypedGETRequest<SingleSpaceRequest>} req - The request object containing the space ID and date range.
 * @param {TypedResponse<{ bookings: AnonymousBooking[] }>} res - The response object containing the list of bookings.
 */
export async function spaceAvailabilities(
  req: TypedGETRequest<SingleSpaceRequest>,
  res: TypedResponse<{ bookings: AnonymousBooking[] }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<IDatetimeRange>(new URLSearchParams(req.query));

    const currentTime = await now();
    const oneWeekFromNow = currentTime;
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const datetimeStart = parsedQuery
      ? parsedQuery.datetimeStart
      : new Date("01/01/2024").toISOString();
    const datetimeEnd = parsedQuery ? parsedQuery.datetimeEnd : oneWeekFromNow.toISOString();

    const spaceExists = await db.select().from(space).where(eq(space.id, req.params.spaceId));

    if (spaceExists.length == 0) {
      res.status(404).json({ error: "Space ID does not exist" });
      return;
    }

    const existingBookings = await db
      .select()
      .from(booking)
      .where(
        and(
          eq(booking.spaceid, req.params.spaceId),
          lte(booking.starttime, datetimeEnd),
          gte(booking.endtime, datetimeStart),
          inArray(booking.currentstatus, ["confirmed", "checkedin", "completed"]),
        ),
      )
      .orderBy(asc(booking.starttime));

    res.json({ bookings: existingBookings.map(formatBookingDates).map(anonymiseBooking) });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

/**
 * Determines if a user has the authority to book a specific space.
 *
 * @param {TypedGETRequest<canBookReq>} req - The request object containing the space ID.
 * @param {TypedResponse<{ canBook: boolean }>} res - The response object indicating if the user can book the space.
 */
export async function roomCanBook(
  req: TypedGETRequest<canBookReq>,
  res: TypedResponse<{ canBook: boolean }>,
) {
  try {
    const roomRes = await db
      .select({
        minreqgrp: space.minreqgrp,
      })
      .from(space)
      .where(eq(space.id, req.params.spaceId));

    if (roomRes.length) {
      res.json({ canBook: hasMinimumAuthority(req.token.group, roomRes[0].minreqgrp) });
      return;
    }

    res.status(404).json({ error: `No room found with id "${req.params.spaceId}"` });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}

/**
 * Checks if a user group has the minimum required authority to book a space.
 *
 * @param {UserGroup} userGrp - The user group of the requester.
 * @param {UserGroup} minReqGrp - The minimum required user group to book the space.
 * @returns {boolean} - True if the user group has the required authority, false otherwise.
 */
export function hasMinimumAuthority(userGrp: UserGroup, minReqGrp: UserGroup): boolean {
  const userGrpIndex = USER_GROUPS.indexOf(userGrp);
  const minReqGrpIndex = USER_GROUPS.indexOf(minReqGrp);

  return userGrpIndex >= minReqGrpIndex;
}

/**
 * Fetches and returns the positions of all hot desks.
 *
 * @param {TypedGETRequest} _req - The request object.
 * @param {TypedResponse<{ desks: { id: string; floor: string; xcoord: number; ycoord: number }[] }>} res - The response object containing the list of hot desks.
 */
export async function deskPositions(
  _req: TypedGETRequest,
  res: TypedResponse<{ desks: { id: string; floor: string; xcoord: number; ycoord: number }[] }>,
) {
  const desks = await db
    .select({
      id: hotdesk.id,
      floor: hotdesk.floor,
      xcoord: hotdesk.xcoord,
      ycoord: hotdesk.ycoord,
    })
    .from(hotdesk);

  res.json({ desks });
}
