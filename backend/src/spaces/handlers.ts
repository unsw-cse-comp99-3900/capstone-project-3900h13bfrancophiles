// Spaces endpoint handlers

import { db } from '../index'
import { eq, sql } from "drizzle-orm"
import { hotdesk, room, space } from '../../drizzle/schema';
import { TypedGETRequest, TypedResponse, Room, Space } from '../types';
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
  req: TypedGETRequest<{}, SingleSpaceRequest>,
  res: TypedResponse<{ space: Space, isRoom: Boolean }>,
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
        type: room.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
      })
      .from(room)
      .innerJoin(space, eq(space.id, room.id))
      .where(eq(room.id, req.params.spaceId));

    if (roomRes.length) {
      res.json({ space: roomRes[0], isRoom: true });
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
      res.json({ space: deskRes[0], isRoom: false });
      return;
    }

    res.status(404).json({ error: `No space found with id "${req.params.spaceId}"` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

export async function allSpaces(
  req: TypedGETRequest,
  res: TypedResponse<{ spaces: { id: string, name: string, isRoom: boolean }[] }>,
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
