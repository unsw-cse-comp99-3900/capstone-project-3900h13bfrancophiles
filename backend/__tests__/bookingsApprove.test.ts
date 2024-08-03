import api from "./helpers/api";
import { ADMINS, HDR, ROOM } from "./helpers/constants";
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
    res = await api.approveBooking(adminToken, bookingRes.json.booking.id);
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);
  });

  test("Success - approving a booking declines overlapping requests", async () => {
    await api.createBooking(
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
    await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(45),
      minutesFromBase(75),
      "funnest times",
    );

    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(3);
    res = await api.approveBooking(adminToken, booking2Res.json.booking.id);
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);
    res = await api.upcomingBookings(hdrToken);
    expect(res.json.bookings[0].currentstatus).toStrictEqual("declined");
    expect(res.json.bookings[1].currentstatus).toStrictEqual("confirmed");
    expect(res.json.bookings[2].currentstatus).toStrictEqual("declined");
  });

  test("Success - editing a booking so that it no longer overlaps does not decline old overlapping bookings", async () => {
    await api.createBooking(
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
    await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(45),
      minutesFromBase(75),
      "funnest times",
    );

    await api.editBooking(
      hdrToken,
      booking2Res.json.booking.id,
      minutesFromBase(90),
      minutesFromBase(105),
      ROOM[0].id,
      "this booking is edited!",
    );

    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(3);
    res = await api.approveBooking(adminToken, booking2Res.json.booking.id);
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(2);
    res = await api.upcomingBookings(hdrToken);
    // upcoming bookings by default returns bookings that are furthest in the furture.
    expect(res.json.bookings[2].currentstatus).toStrictEqual("pending");
    expect(res.json.bookings[1].currentstatus).toStrictEqual("pending");
    expect(res.json.bookings[0].currentstatus).toStrictEqual("confirmed");
  });

  test("Success - edited bookings need to be approved again ", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(30),
      minutesFromBase(60),
      "funner times",
    );

    let res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(1);
    res = await api.approveBooking(adminToken, bookingRes.json.booking.id);
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);

    const editBookingRes = await api.editBooking(
      hdrToken,
      bookingRes.json.booking.id,
      minutesFromBase(90),
      minutesFromBase(105),
      ROOM[0].id,
      "this booking is edited!",
    );

    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(1);
    res = await api.approveBooking(adminToken, editBookingRes.json.booking.id);
    expect(res.status).toStrictEqual(200);
    res = await api.pendingBookings(adminToken, 1, 5, "soonest");
    expect(res.json.bookings).toHaveLength(0);
    res = await api.upcomingBookings(hdrToken);
    expect(res.json.bookings[0].currentstatus).toStrictEqual("confirmed");
  });

  test("Success - approved booking is edited, and the pending edit is approved", async () => {
    const initialBooking = {
      zid: HDR[0].zid,
      starttime: minutesFromBase(15).toISOString(),
      endtime: minutesFromBase(45).toISOString(),
      spaceid: ROOM[0].id,
      currentstatus: "pending",
      description: "fun times",
    };
    const editedBooking = {
      zid: HDR[0].zid,
      starttime: minutesFromBase(15).toISOString(),
      endtime: minutesFromBase(45).toISOString(),
      spaceid: ROOM[0].id,
      currentstatus: "pending",
      description: "I edited this booking!",
    };

    // Create booking
    const res = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: initialBooking,
    });
    const booking = res.json.booking;

    // Admin approves booking
    await api.approveBooking(adminToken, booking.id);
    initialBooking.currentstatus = "confirmed";

    // User edits bookings
    const res2 = await api.editBooking(
      hdrToken,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res2.status).toStrictEqual(200);
    expect(res2.json).toMatchObject({
      booking: editedBooking,
    });
    const booking2 = res2.json.booking;
    // Admin approves edit
    await api.approveBooking(adminToken, booking2.id);
    editedBooking.currentstatus = "confirmed";

    const res3 = await api.upcomingBookings(hdrToken);
    expect(res3.status).toStrictEqual(200);
    expect(res3.json.bookings[0]).toMatchObject(editedBooking);
    expect(res3.json.bookings.length == 1);
  });

  test("Failure - booking cannot be declined by unauthorised user", async () => {
    const bookingRes = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );

    const res = await api.approveBooking(hdrToken, bookingRes.json.booking.id);
    expect(res.status).toStrictEqual(403);
  });


  test("Failure - booking does not exist", async () => {
    await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );

    const res = await api.approveBooking(adminToken, 0);
    expect(res.status).toStrictEqual(500);
  });

  test("Failure - approve invalid inputs", async () => {
    let res = await api.apiCall("/admin/bookings/approve", "PUT", { input: "invalid" }, adminToken);
    expect(res.status).toStrictEqual(400);
  });
});
