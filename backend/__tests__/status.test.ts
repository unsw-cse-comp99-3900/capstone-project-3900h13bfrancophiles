import api from "./helpers/api";
import { ADMINS, DESK, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase, mockCurrentTime } from "./helpers/helpers";

const defaultStatus = Object.fromEntries([
  ...DESK.map(({ id }) => [id, { status: "Available" }]),
  ...ROOM.map(({ id }) => [id, { status: "Available" }]),
]);

describe("/status", () => {
  test("No bookings", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.status(token, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject(defaultStatus);
  });

  test("Confirmed bookings", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, DESK[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking1 = res.json.booking;
    expect(booking1.currentstatus).toStrictEqual("confirmed");

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking2 = res.json.booking;
    expect(booking2.currentstatus).toStrictEqual("confirmed");

    res = await api.status(token, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject({
      ...defaultStatus,
      [DESK[0].id]: {
        status: "Unavailable",
        booking: booking1,
      },
      [ROOM[0].id]: {
        status: "Unavailable",
        booking: booking2,
      },
    });
  });

  test("Pending booking", async () => {
    let res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;
    expect(booking.currentstatus).toStrictEqual("pending");

    res = await api.status(token, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject(defaultStatus);
  });

  test("Deleted booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, DESK[0].id, minutesFromBase(15), minutesFromBase(75), "");
    let booking = res.json.booking;

    res = await api.deleteBooking(booking.id, token);
    booking = res.json.booking;
    expect(booking.currentstatus).toStrictEqual("deleted");

    res = await api.status(token, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject(defaultStatus);
  });

  test("Declined booking", async () => {
    let res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    const hdrToken = res.json.token;

    res = await api.createBooking(
      hdrToken,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(75),
      "",
    );
    const booking = res.json.booking;
    expect(booking.currentstatus).toStrictEqual("pending");

    res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    await api.declineBooking(res.json.token, booking.id);

    res = await api.status(hdrToken, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject(defaultStatus);
  });

  test("Checked-in booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    let booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkinBooking(token, booking.id);
    booking = res.json.booking;
    expect(booking.currentstatus).toStrictEqual("checkedin");

    res = await api.status(token, minutesFromBase(30), minutesFromBase(60));
    expect(res.json).toMatchObject({
      ...defaultStatus,
      [ROOM[0].id]: {
        status: "Unavailable",
        booking,
      },
    });
  });
});
