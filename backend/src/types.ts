import { Request, Response } from "express";
import { Send } from "express-serve-static-core";
import { bookingstatusenum } from "../drizzle/schema";
import { tags } from "typia";

// Order matters - lowest to highest
export const USER_GROUPS = ["other", "hdr", "csestaff", "admin"] as const;
export type UserGroup = (typeof USER_GROUPS)[number];

/**
 * Payload stored with JWT auth tokens
 */
export interface TokenPayload {
  id: string;
  user: number; // zid
  group: UserGroup;
}

// Voodoo shit to allow adding tokens to Requests
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  module Express {
    interface Request {
      token: TokenPayload;
    }
  }
}

// Because {} is not an empty object for some reason
type Empty = Record<string, never>;

/*
 * Typed request for methods other than GET
 * B is the type of the body (req.body)
 * P is the type of the path params (req.params)
 */
export interface TypedRequest<B = Empty, P = Empty> extends Request<P> {
  body: B;
  params: P;
  token: TokenPayload;
}

/*
 * Typed request for GET methods
 * Q is the type of the query params (req.query)
 * P is the type of the path params (req.params)
 */
export interface TypedGETRequest<P = Empty> extends TypedRequest<Empty, P> {
  query: Record<string, string>;
}

/*
 * Typed response object for all methods
 * T is the type of the response body
 */
export interface TypedResponse<T = Empty> extends Response {
  json: Send<T | { error: string }, this>;
}

/**
 * Booking typed response
 */
export type Booking = {
  id: number;
  zid: number;
  starttime: string;
  endtime: string;
  spaceid: string;
  currentstatus: BookingStatus;
  description: string;
  checkintime: string | null;
  checkouttime: string | null;
  parent: number | null;
  created: string;
  modified: string;
};

export interface BookingEditRequest {
  id: number;
  starttime?: string & tags.Format<"date-time">;
  endtime?: string & tags.Format<"date-time">;
  spaceid?: string;
  description?: string;
}

export type AnonymousBooking = Omit<Booking, "description">;

/**
 * Room typed response
 */
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
  xcoord: number;
  ycoord: number;
};

export type Space = Room | Desk;

export type SpaceType = "room" | "desk";

export interface IDatetimeRange {
  datetimeStart: string & tags.Format<"date-time">;
  datetimeEnd: string & tags.Format<"date-time">;
}

export interface BookingDetailsRequest {
  spaceid: string;
  starttime: string & tags.Format<"date-time">;
  endtime: string & tags.Format<"date-time">;
  description: string;
}

export type BookingStatus = (typeof bookingstatusenum.enumValues)[number];

export interface EmailRecipient {
  name: string;
  email: string & tags.Format<"email">;
}

export interface EmailContents {
  subject: string;
  text: string;
  html: string;
}
export type User = {
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
