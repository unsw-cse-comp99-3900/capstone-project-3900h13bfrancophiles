import { ADMINS } from './helpers/constants';
import api from './helpers/api';

describe("auth route tests", () => {
  it("successfully logs in", async () => {
    const res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      token: expect.any(String),
    });
  });

  it("fails to log in if invalid password", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, undefined);
    expect(res.status).toStrictEqual(400);

    res = await api.login(`z${ADMINS[0].zid}`, "password");
    expect(res.status).toStrictEqual(400);
  });

  it("fails to log out if invalid token provided", async () => {
    const res = await api.logout("NOT A REAL TOKEN");
    expect(res.status).toStrictEqual(401);
  });

  it("successfully logs out", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.logout(token);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({});

    // Shouldn't work, because now logged out
    res = await api.logout(token);
    expect(res.status).toStrictEqual(401);
  });
});