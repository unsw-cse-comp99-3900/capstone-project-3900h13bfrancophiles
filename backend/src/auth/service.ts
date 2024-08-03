import { decodeJwt, jwtVerify, SignJWT } from "jose";
import * as crypto from "node:crypto";
import { person } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

import { AUTH_SECRET } from "../../config";
import { db } from "../index";
import { TokenPayload, UserGroup } from "../types";
import { now } from "../utils";

// Helpers for managing tokens
const ENCODED_SECRET = new TextEncoder().encode(AUTH_SECRET);
const EXPIRY_TIME_MS = 1000 * 60 * 60 * 24;
const activeTokenIds = new Set<string>();

/**
 * Validates the login credentials by checking the zid and zpass against an external API.
 *
 * @param {number} zid - The user's zID.
 * @param {string} zpass - The user's password.
 * @returns {Promise<boolean> } A promise that resolves to a boolean indicating whether the login is valid.
 */
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

/**
 * Retrieves the user group for the given zID.
 *
 * @param {number} zid - The user's zID.
 * @returns {Promise<UserGroup | undefined>} A promise that resolves to the user's group, or undefined if the user is not found.
 */
export async function getUserGroup(zid: number): Promise<UserGroup | undefined> {
  // TODO: Integrate with UNSW db
  const res = await db.select({ group: person.usergrp }).from(person).where(eq(person.zid, zid));

  return res?.[0]?.group;
}

/**
 * Creates a JWT token for the user with the specified group.
 *
 * @param {number} user - The user's ID.
 * @param {UserGroup} group - The user's group.
 * @returns {string} The created JWT token string.
 */
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

/**
 * Verifies the given JWT token and returns the payload.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<TokenPayload>} A promise that resolves to the token payload.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify<TokenPayload>(token, ENCODED_SECRET, {
    currentDate: await now(),
  });
  return { id: payload.id, user: payload.user, group: payload.group };
}

/**
 * Decodes the given JWT token and returns the payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {TokenPayload} The token payload.
 */
export function decodeToken(token: string): TokenPayload {
  const payload = decodeJwt<TokenPayload>(token);
  return { id: payload.id, user: payload.user, group: payload.group };
}

/**
 * Invalidates the given JWT token by removing its ID from the active tokens set.
 *
 * @param {string} token - The JWT token to invalidate.
 */
export function invalidateToken(token: string) {
  const payload = decodeToken(token);
  activeTokenIds.delete(payload.id);
}

/**
 * Invalidates the JWT token with the given ID by removing it from the active tokens set.
 *
 * @param {string} tokenId - The ID of the token to invalidate.
 */
export function invalidateTokenById(tokenId: string) {
  activeTokenIds.delete(tokenId);
}

/**
 * Checks if the JWT token with the given ID is active.
 *
 * @param {string} tokenId - The ID of the token to check.
 * @returns {boolean} A boolean indicating whether the token is active.
 */
export function tokenIdIsActive(tokenId: string) {
  return activeTokenIds.has(tokenId);
}
