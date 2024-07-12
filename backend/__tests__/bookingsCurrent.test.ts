import api from './helpers/api';
import { ADMINS, ROOM } from './helpers/constants';
import { minutesFromBase, mockCurrentTime } from './helpers/helpers';

describe("/auth/login", () => {
  test("Success - one booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "fun times");
    const booking = res.json.booking;

    // Fast-forward to the middle of the booking
    await mockCurrentTime(minutesFromBase(30));
    res = await api.currentBookings(token);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      bookings: [booking]
    });
  });
});