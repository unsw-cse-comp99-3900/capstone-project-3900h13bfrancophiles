import api from "./helpers/api";
import { ADMINS, DESK, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/bookings/approve", () => {
  let hdrToken: string;
  let adminToken: string;

  beforeEach(async () => {
    const hdrLogin = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    hdrToken = hdrLogin.json.token;

    const adminLogin = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    adminToken = adminLogin.json.token;
  });

  test("Success - approving a booking", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(1);
    res = await api.approveBooking(adminToken, bookingRes.json.booking.id)
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);
  });

  test("Success - approving a booking declines overlapping requests", async () => {
    const booking1Res = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    const booking2Res = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(30),
      minutesFromBase(60),
      "funner times",
    );
    const booking3Res = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(45),
      minutesFromBase(75),
      "funnest times",
    );

    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(3);
    res = await api.approveBooking(adminToken, booking2Res.json.booking.id)
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);
    res = await api.upcomingBookings(hdrToken);
    expect(res.json.bookings[0].currentstatus).toStrictEqual("declined");
    expect(res.json.bookings[1].currentstatus).toStrictEqual("confirmed");
    expect(res.json.bookings[2].currentstatus).toStrictEqual("declined");
  });

  test("Failure - booking cannot be declined by unauthorised user", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );

    const res = await api.approveBooking(hdrToken, bookingRes.json.booking.id)
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

    const res = await api.approveBooking(adminToken, 0)
    expect(res.status).toStrictEqual(500);
  });
});
