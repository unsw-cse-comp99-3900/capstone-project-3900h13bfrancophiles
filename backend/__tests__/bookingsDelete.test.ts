import api from './helpers/api';
import { ADMINS, ROOM } from './helpers/constants';
import { minutesFromBase, mockCurrentTime } from './helpers/helpers';

describe("/bookings/delete", () => {
  test("Success - deleted one booking", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), "fun times");
    const booking = res.json.booking;

    res = await api.upcomingBookings(token);
    expect(res.json).toEqual({
      bookings: [booking]
    });

    res = await api.deleteBooking(booking.id, token);

    res = await api.upcomingBookings(token);
    expect(res.json).toEqual({
      bookings: []
    });
  });
});
