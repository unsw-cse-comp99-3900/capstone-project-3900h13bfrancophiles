// Authentication and authorisation middleware
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import typia from "typia";

import { AUTH_SECRET } from '../../config';
import { TokenPayload, TypedRequest } from '../types';
import { tokenIsActive } from './auth';

// Middleware implementation
export function validateToken(req: TypedRequest, res: Response, next: NextFunction) {
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