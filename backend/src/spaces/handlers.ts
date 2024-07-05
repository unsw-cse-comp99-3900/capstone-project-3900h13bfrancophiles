// Spaces endpoint handlers

import { db } from '../index'
import { eq, and, asc, gt } from "drizzle-orm"
import { hotdesk, room, space, booking } from '../../drizzle/schema';
import { TypedGETRequest, TypedResponse, Room, Space, Booking } from '../types';
import typia from 'typia';

export async function roomDetails(
  req: TypedGETRequest,
  res: TypedResponse<{ rooms: Room[] }>,
) {
  try {
    const rooms = await db
      .select({
        id: room.id,
        name: space.name,
        type: space.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
        usage: room.usage
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
  req: TypedGETRequest<{}, SingleSpaceRequest>,
  res: TypedResponse<{ space: Space }>,
) {
  try {
    if (!typia.is<SingleSpaceRequest>(req.params)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    // TODO: Maybe find a way to distinguish between room/desk?
    // Try get it as a room
    const roomRes = await db
      .select({
        id: room.id,
        name: space.name,
        type: space.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
        usage: room.usage
      })
      .from(room)
      .innerJoin(space, eq(space.id, room.id))
      .where(eq(room.id, req.params.spaceId));

    if (roomRes.length) {
      res.json({ space: roomRes[0] });
      return;
    }

    // Try get it as a desk
    const deskRes = await db
      .select({
        id: hotdesk.id,
        name: space.name,
        floor: hotdesk.floor,
        room: hotdesk.room,
        desknumber: hotdesk.desknumber
      })
      .from(hotdesk)
      .innerJoin(space, eq(space.id, hotdesk.id))
      .where(eq(hotdesk.id, req.params.spaceId));

    if (deskRes.length) {
      res.json({ space: deskRes[0] });
      return;
    }

    res.status(404).json({ error: `No space found with id "${req.params.spaceId}"` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

export async function spaceAvailabilities(
  req: TypedGETRequest<{}, SingleSpaceRequest>,
  res: TypedResponse<{ bookings: Booking[] }>,
) {
  try {
    if (!typia.is<SingleSpaceRequest>(req.params)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const currentTime = new Date().toISOString();

    const spaceExists = await db
      .select()
      .from(space)
      .where(
        eq(space.id, req.params.spaceId),
      )

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
          gt(booking.starttime, currentTime)
        )
      )
      .orderBy(
        asc(booking.starttime)
      )

      res.json({ bookings: existingBookings });
      return

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}
