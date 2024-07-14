import typia from 'typia';

import {
  createToken,
  getUserGroup,
  invalidateToken,
  validateLogin
} from './auth';
import {
  TypedRequest,
  TypedResponse
} from '../types';

const ZID_REGEX = /z(\d{7})/

type LoginRequest = { zid: string, zpass: string };

export async function login(
  req: TypedRequest<LoginRequest>,
  res: TypedResponse<{ token: string }>,
) {
  if (!typia.is<LoginRequest>(req.body)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const match = req.body.zid.match(ZID_REGEX);
  if (!match) {
    res.status(400).json({ error: "Invalid zID" });
    return;
  }
  const zid = parseInt(match[1]);

  if (!validateLogin(zid, req.body.zpass)) {
    res.status(400).json({ error: "Incorrect login" });
    return;
  }

  const group = await getUserGroup(zid);
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


