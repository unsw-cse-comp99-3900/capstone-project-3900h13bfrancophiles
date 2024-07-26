import { eq, and, asc, gt, sql, or, lte, gte } from 'drizzle-orm';
import { hotdesk, room, space, booking } from '../../drizzle/schema';

import { db } from '../index';
import { TypedGETRequest, TypedResponse, Room, Space, AnonymousBooking, SpaceType, IDatetimeRange } from '../types';
import { anonymiseBooking, formatBookingDates, now } from '../utils';
import typia from 'typia';
import { date } from 'drizzle-orm/mysql-core';

export async function roomDetails(req: TypedGETRequest, res: TypedResponse<{ rooms: Room[] }>) {
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
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

type SingleSpaceRequest = { spaceId: string };

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
      res.json({ space: roomRes[0], type: 'room' });
      return;
    }

    // Try get it as a desk
    const deskRes = await db
      .select({
        id: hotdesk.id,
        name: space.name,
        floor: hotdesk.floor,
        xcoord: hotdesk.xcoord,
        ycoord: hotdesk.ycoord
      })
      .from(hotdesk)
      .innerJoin(space, eq(space.id, hotdesk.id))
      .where(eq(hotdesk.id, req.params.spaceId));

    if (deskRes.length) {
      res.json({ space: deskRes[0], type: 'desk' });
      return;
    }

    res.status(404).json({ error: `No space found with id "${req.params.spaceId}"` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

export async function allSpaces(
  req: TypedGETRequest,
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

export async function spaceAvailabilities(
  req: TypedGETRequest<SingleSpaceRequest>,
  res: TypedResponse<{ bookings: AnonymousBooking[] }>,
) {
  try {
    const currentTime = (await now()).toISOString();
    const parsedQuery = typia.http.isQuery<IDatetimeRange>(new URLSearchParams(req.query));
    // if (!parsedQuery) {
    //   res.status(400).json({ error: 'Invalid input' });
    //   return;
    // }

    const oneWeekFromNow = new Date(currentTime);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const datetimeStart = parsedQuery ? parsedQuery.datetimeStart : new Date("01/01/2024").toISOString();
    const datetimeEnd = parsedQuery ? parsedQuery.datetimeEnd : oneWeekFromNow.toISOString();

    const spaceExists = await db
      .select()
      .from(space)
      .where(
        eq(space.id, req.params.spaceId)
      );

    if (spaceExists.length == 0) {
      res.status(404).json({ error: 'Space ID does not exist' });
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
          or(
            eq(booking.currentstatus, 'confirmed'),
            eq(booking.currentstatus, 'checkedin')
          ),
        )
      )
      .orderBy(asc(booking.starttime));

    res.json({ bookings: existingBookings.map(formatBookingDates).map(anonymiseBooking) });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

export async function deskPositions(
  req: TypedGETRequest,
  res: TypedResponse<{ desks: { id: string; floor: string; xcoord: number, ycoord: number }[] }>,
) {
  const desks = await db
    .select({
      id: hotdesk.id,
      floor: hotdesk.floor,
      xcoord: hotdesk.xcoord,
      ycoord: hotdesk.ycoord
    })
    .from(hotdesk);

  res.json({ desks });
}