// Route handlers for login and logout

import { TypedRequest, TypedResponse } from '../types';
import { createToken, getUserGroup, invalidateToken, validateLogin } from './auth';
import typia from 'typia';

const ZID_REGEX = /z(\d{7})/

type LoginRequest = { zid: string, zpass: string };

export function login(
  req: TypedRequest<LoginRequest>,
  res: TypedResponse<{ token: string }>,
) {
  if (!typia.is<LoginRequest>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const match = req.body.zid.match(ZID_REGEX);
  if (!match) {
    res.status(400).json({ error: "Non-existent zID" });
    return;
  }
  const zid = parseInt(match[1]);

  if (!validateLogin(zid, req.body.zpass)) {
    res.status(400).json({ error: "Incorrect login" });
    return;
  }

  const group = getUserGroup(zid);
  const token = createToken(zid, group);
  res.json({ token });
}

export function logout(
  req: TypedRequest,
  res: TypedResponse,
) {
  const tokenId = req.token.id;
  invalidateToken(tokenId);
  res.json({});
}


