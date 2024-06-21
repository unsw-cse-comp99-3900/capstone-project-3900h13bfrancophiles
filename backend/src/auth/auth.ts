import * as jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';

import { TokenPayload, UserGroup } from '../types';
import { AUTH_SECRET } from '../../config';

// Helpers for validating user and password
export function validateLogin(zid: number, zpass: string): boolean {
  // TODO: Integrate with UNSW db
  return `z${zid}` === zpass;
}

// Helpers for managing permissions
export function getUserGroup(zid: number): UserGroup {
  // TODO: store and fetch user groups
  return "admin";
}

// Helpers for managing tokens
const EXPIRY_TIME_MS = 1000 * 60 * 60 * 24;
const activeTokenIds = new Set<string>();

export function createToken(user: number, group: UserGroup): string {
  const id = crypto.randomUUID();
  const payload: TokenPayload = { id, user, group };
  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: EXPIRY_TIME_MS });

  activeTokenIds.add(id);
  setTimeout(() => activeTokenIds.delete(id), EXPIRY_TIME_MS);

  return token;
}

export function invalidateToken(tokenId: string) {
  activeTokenIds.delete(tokenId);
}

export function tokenIsActive(tokenId: string) {
  return activeTokenIds.has(tokenId);
}
