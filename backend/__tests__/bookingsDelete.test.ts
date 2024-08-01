import api from "./helpers/api";
import { ADMINS, ROOM } from "./helpers/constants";
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
    let res = await api.apiCall("/bookings/delete", "DELETE", { input: "input" }, token);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure - Booking ID does not exist", async () => {
    let res = await api.deleteBooking(
      1,
      token,
    );
    expect(res.status).toStrictEqual(404);
  });
});
