
export type Booking = { id: number, zid: number, starttime: string , endtime: string, spaceid: int, currentstatus: string, description: string };

export type Room = { id: string, name: string, type: string, capacity: number, roomnumber: string, usage: string };

export type Desk = { id: string, name: string, floor: string, room: string, desknumber: number };

export type Space = Room | Desk;