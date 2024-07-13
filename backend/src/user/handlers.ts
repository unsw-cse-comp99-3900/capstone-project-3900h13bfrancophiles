import {TypedGETRequest, TypedResponse, User} from "../types";
import {db} from "../index";
import {person} from "../../drizzle/schema";
import {eq} from "drizzle-orm";
import typia, {tags} from "typia";

interface UserRequest {
  zid: number & tags.Minimum<1000000> & tags.Maximum<9999999>;
}

export async function userDetails(
  req: TypedGETRequest,
  res: TypedResponse<{ user: User }>,
) {
  try {
    const parsedQuery = typia.http.isQuery<UserRequest>(new URLSearchParams(req.params));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = parsedQuery.zid;

    const userRes = await db
      .select()
      .from(person)
      .where(
        eq(person.zid, zid)
      )
      .limit(1);

    if (userRes.length) {
      res.json({ user: userRes[0] });
      return
    }

    res.status(404).json({ error: `No user found with id "${req.params.zid}"` });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
