export type Booking = { id: number, zid: number, starttime: string, endtime: string, spaceid: string, currentstatus: string, description: string, checkintime: string | null, checkouttime: string | null };

export type Room = { id: string, name: string, type: string, capacity: number, roomnumber: string };

export type Desk = { id: string, name: string, floor: string, room: string, desknumber: number };

export type Space = Room | Desk;

export type Status = { status: "available" }
  | { status: "unavailable", booking: Booking };

export type User = null | { name: string, image: string }

export type BookingUser =   {zid: number;
email: string;
fullname: string;
title: string | null;
school: string;
faculty: string;
role: string | null;
usergrp: "other" | "hdr" | "csestaff" | "admin";
}
export type SpaceOption = { name: string; id: string; isRoom: boolean };
