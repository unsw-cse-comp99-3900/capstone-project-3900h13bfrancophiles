// Spaces endpoint handlers

import { db } from '../index'
import { eq } from "drizzle-orm"
import { room, space } from '../../drizzle/schema';
import { TypedGETRequest, TypedResponse, Room } from '../types';

export async function roomDetails(
  req: TypedGETRequest,
  res: TypedResponse<{ rooms: Room[] }>,
) {
  try {
    const rooms = await db
      .select({
        id: room.id,
        name: space.name,
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
