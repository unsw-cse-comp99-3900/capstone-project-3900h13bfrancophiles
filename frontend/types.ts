export type Booking = { id: number, zid: number, starttime: string, endtime: string, spaceid: string, currentstatus: string, description: string, checkintime: string | null, checkouttime: string | null };

export type AnonymousBooking = Omit<Booking, 'zid' | 'description'>;

export type Room = { id: string, name: string, type: string, capacity: number, roomnumber: string };

export type Desk = { id: string, name: string, floor: string, room: string, desknumber: number };

export type Space = Room | Desk;

export type SpaceOption = { name: string; id: string; isRoom: boolean };
