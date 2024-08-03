// Authentication and authorisation middleware
import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import typia from "typia";

import { invalidateToken, tokenIdIsActive, verifyToken } from "./service";
import { TokenPayload, UserGroup, USER_GROUPS } from "../types";

/**
 * Middleware to validate the provided JWT token.
 *
 * @param {Request} req - The HTTP request object, expecting an Authorization header.
 * @param {Response} res - The HTTP response object to send back error messages if the token is invalid.
 * @param {NextFunction} next - The next middleware function to be called if the token is valid.
 */
export async function validateToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const [scheme, token] = req.headers.authorization.split(" ");
  if (scheme !== "Bearer") {
    res.status(401).json({ error: "Unsupported authorization scheme - use Bearer" });
    return;
  } else if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const payload = await verifyToken(token);
    if (!typia.is<TokenPayload>(payload)) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    if (!tokenIdIsActive(payload.id)) {
      res.status(401).json({ error: "Token expired or invalidated" });
      return;
    }

    req.token = payload;
    next();
  } catch (e) {
    if (e instanceof jose.errors.JWTExpired) {
      invalidateToken(token);
      res.status(401).json({ error: "Token expired" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

/**
 * Middleware to authorize a user based on their group.
 *
 * @param {UserGroup} group - The user group that is allowed access to the route.
 * @throws {Error} - Throws an error if the user's group does not match the required group.
 * @returns {NextFunction} A middleware function to check the user's group and grant or deny access.
 */
export function authorise(group: UserGroup) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userGroup = req.token.group;
    if (userGroup !== group) {
      res.status(403).json({ error: "You do not have permission to access this route" });
    } else {
      next();
    }
  };
}

/**
 * Middleware to authorize a user if they are in the specified user group or higher.
 *
 * @param {UserGroup} group - The minimum user group required to access the route.
 * @returns {NextFunction} A middleware function to check the user's group and grant or deny access based on hierarchy.
 */
export function authoriseAtLeast(group: UserGroup) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userGroupIdx = USER_GROUPS.indexOf(req.token.group);
    const groupIdx = USER_GROUPS.indexOf(group);
    if (userGroupIdx < groupIdx) {
      res.status(403).json({ error: "You do not have permission to access this route" });
    } else {
      next();
    }
  };
}
