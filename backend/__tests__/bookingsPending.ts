import api from "./helpers/api";
import { ADMINS, DESK, ROOM } from "./helpers/constants";
import { minutesFromBase, mockCurrentTime } from "./helpers/helpers";

describe("/bookings/pending", () => {
  test("Success - 1 pending booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "fun times",
    );
    const booking = res.json.booking;

    // Fast-forward to after the booking
    await mockCurrentTime(minutesFromBase(80));
    res = await api.pastBookings(token, 1, 5, "all", "newest");
    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      bookings: [booking],
      total: 1,
    });
  });

  test("Success - Sorting by newest and oldest", async () => {
    let res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res1.json.token;

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
      ROOM[1].id,
      minutesFromBase(30),
      minutesFromBase(90),
      "fun times2",
    );
    const booking2 = res2.json.booking;

    // Fast-forward to after the booking
    await mockCurrentTime(minutesFromBase(95));

    // Sort newest
    res1 = await api.pastBookings(token, 1, 5, "all", "newest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking2, booking1],
      total: 2,
    });

    // Sort oldest
    res2 = await api.pastBookings(token, 1, 5, "all", "oldest");
    expect(res2.status).toStrictEqual(200);
    expect(res2.json).toEqual({
      bookings: [booking1, booking2],
      total: 2,
    });
  });

  test("Success - Sorting by desks and rooms only", async () => {
    let res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res1.json.token;

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
      DESK[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "fun times2",
    );
    const booking2 = res2.json.booking;

    // Fast-forward to after the booking
    await mockCurrentTime(minutesFromBase(80));

    // Sort desks only
    res1 = await api.pastBookings(token, 1, 5, "desks", "newest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking2],
      total: 1,
    });

    // Sort rooms only
    res2 = await api.pastBookings(token, 1, 5, "rooms", "newest");
    expect(res2.status).toStrictEqual(200);
    expect(res2.json).toEqual({
      bookings: [booking1],
      total: 1,
    });
  });

  test("Success - Pagination/ Limit", async () => {
    let res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res1.json.token;

    res1 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(30),
      "fun times",
    );
    const booking1 = res1.json.booking;
    const res2 = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(30),
      minutesFromBase(45),
      "fun times2",
    );
    const booking2 = res2.json.booking;
    const res3 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(45),
      minutesFromBase(60),
      "fun times2",
    );
    const booking3 = res3.json.booking;
    const res4 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(60),
      minutesFromBase(75),
      "fun times2",
    );
    const booking4 = res4.json.booking;
    const res5 = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(75),
      minutesFromBase(90),
      "fun times2",
    );
    const booking5 = res5.json.booking;
    const res6 = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(90),
      minutesFromBase(105),
      "fun times2",
    );
    const booking6 = res6.json.booking;

    // Fast-forward to after the booking
    await mockCurrentTime(minutesFromBase(105));

    // Limit 5 per page --------
    // Sort newest - page 1
    res1 = await api.pastBookings(token, 1, 5, "all", "newest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking6, booking5, booking4, booking3, booking2],
      total: 6,
    });

    // Sort newest - page 2
    res1 = await api.pastBookings(token, 2, 5, "all", "newest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking1],
      total: 6,
    });

    // Sort oldest - page 1
    res1 = await api.pastBookings(token, 1, 5, "all", "oldest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking1, booking2, booking3, booking4, booking5],
      total: 6,
    });

    // Sort oldest - page 2
    res1 = await api.pastBookings(token, 2, 5, "all", "oldest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking6],
      total: 6,
    });

    // Limit 10 per page
    res1 = await api.pastBookings(token, 1, 10, "all", "oldest");
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toEqual({
      bookings: [booking1, booking2, booking3, booking4, booking5, booking6],
      total: 6,
    });
  });
});
