import api from "./helpers/api";
import { ADMINS, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase, mockCurrentTime } from "./helpers/helpers";

describe("/bookings/pending", () => {
  test("Success - 1 pending booking", async () => {
    let res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    let token = res.json.token;

    res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "fun times",
    );
    const booking = res.json.booking;

    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    token = res1.json.token;

    res = await api.pendingBookings(token, 1, 5, "soonest");

    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      bookings: [booking],
      total: 1,
    });
  });

  test("Success - Sorting by soonest and latest", async () => {
    let res1 = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    let token = res1.json.token;

    res1 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "fun times",
    );
    const booking1 = res1.json.booking;

    let res2 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(30),
      minutesFromBase(90),
      "fun times2",
    );
    const booking2 = res2.json.booking;

    res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    token = res1.json.token;

    // Sort newest
    res1 = await api.pendingBookings(token, 1, 5, "soonest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking1, booking2],
      total: 2,
    });

    // Sort oldest
    res2 = await api.pendingBookings(token, 1, 5, "latest");
    expect(res2.status).toStrictEqual(200);
    expect(res2.json).toEqual({
      bookings: [booking2, booking1],
      total: 2,
    });
  });

  test("Success - Doesn't include past pending bookings", async () => {
    let res1 = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    let token = res1.json.token;

    await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "past booking",
    );

    await mockCurrentTime(minutesFromBase(60));
    const res2 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(90),
      minutesFromBase(105),
      "future booking",
    );
    const booking2 = res2.json.booking;

    res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    token = res1.json.token;

    res1 = await api.pendingBookings(token, 1, 5, "soonest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking2],
      total: 1,
    });
  });

  test("Failure - pending invalid input", async () => {
    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const admintoken = res1.json.token;
    const res = await api.apiCall(
      `/admin/bookings/pending?input=invalid`,
      "GET",
      undefined,
      admintoken,
    );
    expect(res.status).toStrictEqual(400);
  });
});
