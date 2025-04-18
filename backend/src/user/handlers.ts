import { person } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import typia, { tags } from "typia";

import { db } from "../index";
import { TypedGETRequest, TypedResponse, User } from "../types";

interface UserRequest {
  zid: number & tags.Minimum<1000000> & tags.Maximum<9999999>;
}

/**
 * Fetches user details based on the provided zid.
 *
 * @param {TypedGETRequest} req - The request object containing query parameters with zid.
 * @param {TypedResponse<{ user: User }>} res - The response object containing user details or an error message.
 */
export async function userDetails(req: TypedGETRequest, res: TypedResponse<{ user: User }>) {
  const parsedQuery = typia.http.isQuery<UserRequest>(new URLSearchParams(req.params));
  if (!parsedQuery) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const zid = parsedQuery.zid;

  const userRes = await db.select().from(person).where(eq(person.zid, zid)).limit(1);

  if (userRes.length) {
    res.json({ user: userRes[0] });
    return;
  }

  res.status(404).json({ error: `No user found with id "${req.params.zid}"` });
}
