import { decodeJwt, jwtVerify, SignJWT } from "jose";
import * as crypto from "node:crypto";
import { person } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

import { AUTH_SECRET } from "../../config";
import { db } from "../index";
import { TokenPayload, UserGroup } from "../types";
import { now } from "../utils";

// Helpers for validating user and password
export async function validateLogin(zid: number, zpass: string): Promise<boolean> {
  // TODO: Remove the escape hatch
  if (`z${zid}` === zpass) return true;

  // TODO: Use something official rather than the CSESoc API
  const res = await fetch("https://id.csesoc.unsw.edu.au/api/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: `z${zid}`, password: zpass }),
  });

  return res.ok;
}

// Helpers for managing permissions
export async function getUserGroup(zid: number): Promise<UserGroup | undefined> {
  // TODO: Integrate with UNSW db
  const res = await db.select({ group: person.usergrp }).from(person).where(eq(person.zid, zid));

  return res?.[0]?.group;
}

// Helpers for managing tokens
const ENCODED_SECRET = new TextEncoder().encode(AUTH_SECRET);
const EXPIRY_TIME_MS = 1000 * 60 * 60 * 24;
const activeTokenIds = new Set<string>();

export async function createToken(user: number, group: UserGroup) {
  const id = crypto.randomUUID();
  const payload: TokenPayload = { id, user, group };

  const iat = Math.floor((await now()).getTime() / 1000);
  const exp = iat + EXPIRY_TIME_MS / 1000;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .sign(ENCODED_SECRET);

  activeTokenIds.add(id);
  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify<TokenPayload>(token, ENCODED_SECRET, {
    currentDate: await now(),
  });
  return { id: payload.id, user: payload.user, group: payload.group };
}

export function decodeToken(token: string): TokenPayload {
  const payload = decodeJwt<TokenPayload>(token);
  return { id: payload.id, user: payload.user, group: payload.group };
}

export function invalidateToken(token: string) {
  const payload = decodeToken(token);
  activeTokenIds.delete(payload.id);
}

export function invalidateTokenById(tokenId: string) {
  activeTokenIds.delete(tokenId);
}

export function tokenIdIsActive(tokenId: string) {
  return activeTokenIds.has(tokenId);
}
