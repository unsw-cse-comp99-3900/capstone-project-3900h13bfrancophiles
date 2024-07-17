// Authentication and authorisation middleware
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import typia from "typia";

import { tokenIsActive } from './service';
import { AUTH_SECRET } from '../../config';
import {
  TokenPayload,
  UserGroup,
  USER_GROUPS
} from '../types';

// Middleware implementation
export function validateToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const [scheme, token] = req.headers.authorization.split(' ');
  if (scheme !== 'Bearer') {
    res.status(401).json({ error: "Unsupported authorization scheme - use Bearer" });
    return;
  } else if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, AUTH_SECRET) as jwt.JwtPayload;
    const payload = { id: decoded.id, user: decoded.user, group: decoded.group };
    if (!typia.is<TokenPayload>(payload)) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    if (!tokenIsActive(payload.id)) {
      res.status(401).json({ error: "Token expired or invalidated" });
      return;
    }

    req.token = payload;
    next();
  } catch (e: any) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

// Authorises a user if they are in the specified user group
export function authorise(group: UserGroup) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userGroup = req.token.group;
    if (userGroup !== group) {
      res.status(403).json({ error: "You do not have permission to access this route" });
    } else {
      next();
    }
  }
}

// Authorises a user if they are in the specified user group or higher
export function authoriseAtLeast(group: UserGroup) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userGroupIdx = USER_GROUPS.indexOf(req.token.group);
    const groupIdx = USER_GROUPS.indexOf(group);
    if (userGroupIdx < groupIdx) {
      res.status(403).json({ error: "You do not have permission to access this route" });
    } else {
      next();
    }
  }
}
