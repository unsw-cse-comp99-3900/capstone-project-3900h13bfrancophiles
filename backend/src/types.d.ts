// File for utility types
import { Request, Response } from 'express';
import { ParamsDictionary, Send } from 'express-serve-static-core';

export type UserGroup = "admin" | "cse-staff" | "hdr" | "other";

/**
 * Payload stored with JWT auth tokens
 */
export interface TokenPayload {
  id: string,
  user: number, // zid
  group: UserGroup,
}

// Voodoo shit to allow adding tokens to Requests
declare global {
  namespace Express {
    interface Request {
      token: TokenPayload
    }
  }
}

/*
 * Typed request for methods other than GET
 * B is the type of the body (req.body)
 * P is the type of the path params (req.params)
 */
export interface TypedRequest<B = {}, P = ParamsDictionary> extends Request<P> {
  body: B,
  params: P,
  token: TokenPayload,
}

/*
 * Typed request for GET methods
 * Q is the type of the query params (req.query)
 * P is the type of the path params (req.params)
 */
export interface TypedGETRequest<Q = {}, P = ParamsDictionary> extends Request<P,any,any,Q> {
  query: Q,
  params: P,
}

/*
 * Typed response object for all methods
 * T is the type of the response body
 */
export interface TypedResponse<T = {}> extends Response {
  json: Send<T | { error: string }, this>;
}