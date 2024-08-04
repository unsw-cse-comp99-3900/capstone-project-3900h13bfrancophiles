export type Booking = {
  id: number;
  zid: number;
  starttime: string;
  endtime: string;
  spaceid: string;
  currentstatus: string;
  description: string;
  checkintime: string | null;
  checkouttime: string | null;
};

export type AnonymousBooking = Omit<Booking, "description">;

export type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  roomnumber: string;
};

export type Desk = {
  id: string;
  name: string;
  floor: string;
};

export type Space = Room | Desk;

export type SpaceType = "room" | "desk";

export type User = null | { name: string; image: string };

export type BookingUser = {
  zid: number;
  email: string;
  fullname: string;
  title: string | null;
  school: string;
  faculty: string;
  role: string | null;
  usergrp: "other" | "hdr" | "csestaff" | "admin";
  image: string | null;
};

export type UserData = {
  name: string;
  image: string | null;
};

export type SpaceOption = { name: string; id: string; isRoom: boolean };

export type Status = { status: "Available" } | { status: "Unavailable"; booking: Booking };

export type StatusResponse = {
  [spaceId: string]: Status;
};

export type DeskPosition = {
  id: string;
  floor: string;
  xcoord: number;
  ycoord: number;
};

export type TimeRange = {
  start: Date;
  end: Date;
};

export const USER_GROUPS = ["other", "hdr", "csestaff", "admin"] as const;
export type UserGroup = (typeof USER_GROUPS)[number];

export interface TokenPayload {
  id: string;
  user: number; // zid
  group: UserGroup;
}

export type NavData = { text: string; href: string };

export type ReportTypeReturn = {
  types: {
    type: string;
    name: string;
    formats: string[];
  }[];
};

export interface ReportSpace {
  text: string;
  value: string;
  type: "room" | "desk";
  level?: string;
}
