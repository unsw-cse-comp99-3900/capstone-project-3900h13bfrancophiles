import api from "./helpers/api";
import { ADMINS, HDR } from "./helpers/constants";

describe("/users", () => {
  test("Success - User details are correct", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.userDetails(token, HDR[0].zid);

    const expected = {
      ...HDR[0],
      image: null,
    };

    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      user: expected,
    });
  });

  test("User does not exist", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.userDetails(token, 9999999);

    expect(res.status).toStrictEqual(404);
  });
});
