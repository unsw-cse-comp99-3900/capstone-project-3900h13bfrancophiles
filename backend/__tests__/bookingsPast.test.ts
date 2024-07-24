import api from './helpers/api';
import { ADMINS, ROOM } from './helpers/constants';
import { minutesFromBase, mockCurrentTime } from './helpers/helpers';

describe('/bookings/past', () => {
  test('Success - past booking', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(75), 'fun times');
    const booking = res.json.booking;

    // Fast-forward to after the booking
    await mockCurrentTime(minutesFromBase(80));
    res = await api.pastBookings(token, 1, 5, 'all', 'newest');
    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      bookings: [booking],
      total: 1,
    });
  });
});
