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
  });

  it("fails to log in if invalid password", async () => {
    let res = await apiCall(
      "/auth/login", "POST",
      { zid: `z${ADMINS[0].zid}` }
    );
    expect(res.status).toEqual(400);

    res = await apiCall(
      "/auth/login", "POST",
      { zid: `z${ADMINS[0].zid}`, zpass: "password" }
    );
    expect(res.status).toEqual(400);
  });

  it("fails to log out if invalid token provided", async () => {
    const res = await apiCall("/auth/logout", "POST", {}, "NOT A REAL TOKEN");
    expect(res.status).toEqual(401);
  });

  it("successfully logs out", async () => {
    let res = await apiCall(
      "/auth/login", "POST",
      { zid: `z${ADMINS[0].zid}`, zpass: `z${ADMINS[0].zid}` }
    );
    const token = res.json.token;

    res = await apiCall("/auth/logout", "POST", {}, token);
    expect(res.status).toEqual(200);

    // Shouldn't work, because now logged out
    res = await apiCall("/auth/logout", "POST", {}, token);
    expect(res.status).toEqual(401);
  });
});