import { User, TypedGETRequest, TypedResponse } from '../types';
import typia from 'typia';
import { db } from '../index';
import { person } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

type Zid = { zid: number };

export async function userData(
  req: TypedGETRequest,
  res: TypedResponse<User>,
) {
  try {
    const parsedQuery = typia.http.isQuery<Zid>(new URLSearchParams(req.query));
    if (!parsedQuery) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const zid = parsedQuery.zid;

    const users = await db
      .select({name: person.fullname, image: person.image})
      .from(person)
      .where(eq(person.zid, zid));

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
