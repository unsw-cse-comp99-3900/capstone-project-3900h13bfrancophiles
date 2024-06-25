// Spaces endpoint handlers

import { db } from '../index'
import { sql, eq } from "drizzle-orm"
import { booking, room } from '../../drizzle/schema';
import { TypedGETRequest, TypedResponse, RoomDetails } from '../types';

export async function roomDetails(
  req: TypedGETRequest,
  res: TypedResponse<{ rooms: RoomDetails[] }>,
) {
  try {
    const rooms = await db
      .select({ id: room.id, capacity: room.capacity, roomnumber: room.roomnumber, usage: room.usage})
      .from(room)
      .orderBy(room.id);

    res.json({ rooms: rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}
