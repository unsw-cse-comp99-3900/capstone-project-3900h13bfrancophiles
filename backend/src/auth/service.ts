import * as jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';
import { person } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

import { AUTH_SECRET } from '../../config';
import { db } from '../index';
import { TokenPayload, UserGroup } from '../types';

// Helpers for validating user and password
export function validateLogin(zid: number, zpass: string): boolean {
  // TODO: Integrate with UNSW db
  return `z${zid}` === zpass;
}

// Helpers for managing permissions
export async function getUserGroup(zid: number): Promise<UserGroup | undefined> {
  // TODO: Integrate with UNSW db
  const res = await db.select({ group: person.usergrp }).from(person).where(eq(person.zid, zid));

  return res?.[0]?.group;
}

// Helpers for managing tokens
const EXPIRY_TIME_MS = 1000 * 60 * 60 * 24;
const activeTokenIds = new Set<string>();

export function createToken(user: number, group: UserGroup): string {
  const id = crypto.randomUUID();
  const payload: TokenPayload = { id, user, group };
  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: EXPIRY_TIME_MS });

  activeTokenIds.add(id);
  const timeout = setTimeout(() => activeTokenIds.delete(id), EXPIRY_TIME_MS);
  timeout.unref();

  return token;
}

export function invalidateToken(tokenId: string) {
  activeTokenIds.delete(tokenId);
}

export function tokenIsActive(tokenId: string) {
  return activeTokenIds.has(tokenId);
}
