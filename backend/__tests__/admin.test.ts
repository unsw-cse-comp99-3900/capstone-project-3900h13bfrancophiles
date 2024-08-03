import api from "./helpers/api";
import { HDR, ADMINS, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/admin/bookings/approve", () => {
  let token: string;
  let admintoken: string;

  beforeEach(async () => {
    const res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;
    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    admintoken = res1.json.token;
  });

  test("Failure - approve decline invalid inputs", async () => {
    let res = await api.apiCall("/admin/bookings/approve", "PUT", { input: "invalid" }, admintoken);
    expect(res.status).toStrictEqual(400);

    res = await api.apiCall("/admin/bookings/decline", "PUT", { input: "invalid" }, admintoken);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure - pending invalid input", async () => {
    const res = await api.apiCall(
      `/admin/bookings/pending?input=invalid`,
      "GET",
      undefined,
      admintoken,
    );
    expect(res.status).toStrictEqual(400);
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
      token,
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
    await api.approveBooking(admintoken, booking.id);
    initialBooking.currentstatus = "confirmed";

    // User edits bookings
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
      booking: editedBooking,
    });
    const booking2 = res2.json.booking;
    // Admin approves edit
    await api.approveBooking(admintoken, booking2.id);
    editedBooking.currentstatus = "confirmed";

    const res3 = await api.upcomingBookings(token);
    expect(res3.status).toStrictEqual(200);
    expect(res3.json.bookings[0]).toMatchObject(editedBooking);
  });
});
