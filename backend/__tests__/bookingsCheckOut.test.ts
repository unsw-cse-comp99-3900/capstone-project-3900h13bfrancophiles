import api from "./helpers/api";
import { ADMINS, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase, mockCurrentTime } from "./helpers/helpers";

describe("/checkout", () => {
  test("Failure: Check-out invalid input", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkinBooking(token, booking.id);
    res = await api.apiCall("/bookings/checkout", "POST", { input: "invalid" }, token);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure: Check-out booking id does not exist for user", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkinBooking(token, booking.id);
    res = await api.checkoutBooking(token, booking.id + 1);
    expect(res.status).toStrictEqual(404);
  });

  test("Failure: Check-out Outside current time window", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkinBooking(token, booking.id);
    await mockCurrentTime(minutesFromBase(200));
    res = await api.checkoutBooking(token, booking.id);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure: Checkout not yet checked-in booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkoutBooking(token, booking.id);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure: Checkout already checked-out booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkinBooking(token, booking.id);
    res = await api.checkoutBooking(token, booking.id);
    res = await api.checkoutBooking(token, booking.id);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure: Checkout pending booking", async () => {
    let res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "");
    const booking = res.json.booking;

    await mockCurrentTime(minutesFromBase(20));
    res = await api.checkoutBooking(token, booking.id);
    expect(res.status).toStrictEqual(400);
  });
});
