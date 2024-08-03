import api from "./helpers/api";
import { ADMINS, DESK, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/bookings/decline", () => {
  let hdrToken: string;
  let adminToken: string;

  beforeEach(async () => {
    const hdrLogin = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    hdrToken = hdrLogin.json.token;

    const adminLogin = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    adminToken = adminLogin.json.token;
  });

  test("Success - decline a booking", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(1);
    res = await api.declineBooking(adminToken, bookingRes.json.booking.id)
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);

  });

  test("Failure - booking cannot be declined by unauthorised user", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );

    const res = await api.declineBooking(hdrToken, bookingRes.json.booking.id)
    expect(res.status).toStrictEqual(403);
  });

  test("Failure - booking does not exist", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );

    const res = await api.declineBooking(adminToken, 0)
    expect(res.status).toStrictEqual(500);
  });
});
