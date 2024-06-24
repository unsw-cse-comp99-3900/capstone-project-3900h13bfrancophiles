// Spaces endpoint handlers

import { db } from '../index'
import { sql, eq } from "drizzle-orm"
import { booking, room } from '../../drizzle/schema';
import { TypedGETRequest, TypedResponse, RoomAvailability } from '../types';

export async function roomDetails(
  req: TypedGETRequest,
  res: TypedResponse<{ rooms: RoomAvailability[] }>,
) {
  try {
    const currentTime = new Date().toISOString();

    const sq = db
    .select()
    .from(booking)
    .where(
      sql`${booking.starttime} < ${currentTime} AND ${booking.endtime} > ${currentTime}`
    ).as('sq');

    const rooms = await db
      .select({ id: room.id, capacity: room.capacity, roomnumber: room.roomnumber, usage: room.usage, bookingstatus: sql<string>`COALESCE(${sq.currentstatus}, 'available')` })
      .from(room)
      .leftJoin(sq, eq(room.id, sq.spaceid))
      .orderBy(room.id);

    res.json({ rooms: rooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}
