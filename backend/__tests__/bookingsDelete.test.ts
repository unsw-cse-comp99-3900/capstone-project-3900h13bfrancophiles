import api from "./helpers/api";
import { ADMINS, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/bookings/delete", () => {
  let token: string;

  beforeEach(async () => {
    const res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    token = res.json.token;
  });

  test("Success - deleted one booking", async () => {
    let res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "fun times",
    );
    const booking = res.json.booking;

    res = await api.upcomingBookings(token);
    expect(res.json).toEqual({
      bookings: [booking],
    });

    res = await api.deleteBooking(booking.id, token);

    res = await api.upcomingBookings(token);
    expect(res.json).toEqual({
      bookings: [],
    });
  });

  test("Failure - Invalid input", async () => {
    const res = await api.apiCall("/bookings/delete", "DELETE", { input: "input" }, token);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure - Booking ID does not exist", async () => {
    const res = await api.deleteBooking(1, token);
    expect(res.status).toStrictEqual(404);
  });

  test("Success - deleting parent also deletes child", async () => {
    let res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;

    res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times",
      },
    });
    const booking = res.json.booking;

    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const admintoken = res1.json.token;

    await api.approveBooking(admintoken, booking.id);

    const res2 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res2.status).toStrictEqual(200);
    expect(res2.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "I edited this booking!",
      },
    });

    res = await api.deleteBooking(booking.id, token);

    res = await api.upcomingBookings(token);
    expect(res.json).toEqual({
      bookings: [],
    });
  });
});
