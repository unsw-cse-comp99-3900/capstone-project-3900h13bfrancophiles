import { ADMINS } from './helpers/constants';
import { apiCall } from './helpers/helpers';

describe("auth route tests", () => {
  it("successfully logs in", async () => {
    const res = await apiCall(
      "/auth/login", "POST",
      { zid: `z${ADMINS[0].zid}`, zpass: `z${ADMINS[0].zid}` }
    );
    expect(res.status).toEqual(200);
    expect(res.json).toHaveProperty("token");
  })
});