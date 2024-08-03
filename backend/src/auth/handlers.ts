import typia from "typia";

import { createToken, getUserGroup, invalidateTokenById, validateLogin } from "./service";
import { TypedRequest, TypedResponse } from "../types";

const ZID_REGEX = /z(\d{7})/;

type LoginRequest = { zid: string; zpass: string };

/**
 * Handles user login by validating credentials and generating an authentication token.
 *
 * @param req - The request object containing the login credentials (zid and zpass).
 * @param res - The response object to send back the authentication token.
 */
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

  if (!(await validateLogin(zid, req.body.zpass))) {
    res.status(400).json({ error: "Incorrect login" });
    return;
  }

  const group = await getUserGroup(zid);
  if (!group) {
    res.status(400).json({ error: "Non-existent user id" });
    return;
  }

  const token = await createToken(zid, group);
  res.json({ token });
}

/**
 * Handles user logout by invalidating the authentication token.
 *
 * @param req - The request object containing the authentication token.
 * @param res - The response object to confirm the logout operation.
 */
export function logout(req: TypedRequest, res: TypedResponse) {
  invalidateTokenById(req.token.id);
  res.json({});
}
