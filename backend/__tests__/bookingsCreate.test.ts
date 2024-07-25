import api from './helpers/api';
import { ADMINS, DESK, HDR, ROOM } from './helpers/constants';
import { minutesFromBase } from './helpers/helpers';

describe('/bookings/create', () => {
  let token: string;

  beforeEach(async () => {
    const res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;
  });

  test('Success - immediately confirmed booking', async () => {
    const res = await api.createBooking(token, DESK[0].id, minutesFromBase(15), minutesFromBase(45), 'fun times');
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: DESK[0].id,
        currentstatus: 'confirmed',
        description: 'fun times',
      },
    });
  });

  test('Success - initially pending booking request', async () => {
    const res = await api.createBooking(token, ROOM[0].id, minutesFromBase(15), minutesFromBase(45), 'fun times');
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: 'pending',
        description: 'fun times',
      },
    });
  });

  test('Failure - non-existent space', async () => {
    const res = await api.createBooking(token, 'K-J17-701', minutesFromBase(15), minutesFromBase(45), 'fun times');
    expect(res.status).toStrictEqual(404);
  });

  test('Failure - no permission to request space', async () => {
    const res = await api.createBooking(token, ROOM[1].id, minutesFromBase(15), minutesFromBase(45), 'fun times');
    expect(res.status).toStrictEqual(403);
  });

  test('Failure - overlapping bookings', async () => {
    await api.createBooking(token, DESK[0].id, minutesFromBase(60), minutesFromBase(120), '');

    let res = await api.login(`z${ADMINS[1].zid}`, `z${ADMINS[1].zid}`);
    const otherToken = res.json.token;

    // Start before, end during
    res = await api.createBooking(otherToken, DESK[0].id, minutesFromBase(30), minutesFromBase(90), '');
    expect(res.status).toStrictEqual(400);

    // Start during, end during
    res = await api.createBooking(otherToken, DESK[0].id, minutesFromBase(75), minutesFromBase(105), '');
    expect(res.status).toStrictEqual(400);

    // Start during, end after
    res = await api.createBooking(otherToken, DESK[0].id, minutesFromBase(90), minutesFromBase(150), '');
    expect(res.status).toStrictEqual(400);

    // Start before, end after
    res = await api.createBooking(otherToken, DESK[0].id, minutesFromBase(30), minutesFromBase(150), '');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - overlapping own booking', async () => {
    await api.createBooking(token, DESK[0].id, minutesFromBase(60), minutesFromBase(120), 'fun times');

    const res = await api.createBooking(token, DESK[0].id, minutesFromBase(30), minutesFromBase(90), 'fun times');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - booking in the past', async () => {
    let res = await api.createBooking(token, DESK[0].id, minutesFromBase(-60), minutesFromBase(-30), 'fun times');
    expect(res.status).toStrictEqual(400);

    res = await api.createBooking(token, DESK[0].id, minutesFromBase(-30), minutesFromBase(30), 'fun times');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - end not after start', async () => {
    let res = await api.createBooking(token, DESK[0].id, minutesFromBase(30), minutesFromBase(30), 'fun times');
    expect(res.status).toStrictEqual(400);

    res = await api.createBooking(token, DESK[0].id, minutesFromBase(45), minutesFromBase(15), 'fun times');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - booking not a multiple of 15 minutes', async () => {
    let res = await api.createBooking(token, DESK[0].id, minutesFromBase(30), minutesFromBase(50), 'fun times');
    expect(res.status).toStrictEqual(400);

    res = await api.createBooking(token, DESK[0].id, minutesFromBase(35), minutesFromBase(60), 'fun times');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - booking not on 15 minute boundaries', async () => {
    const res = await api.createBooking(token, DESK[0].id, minutesFromBase(20), minutesFromBase(50), 'fun times');
    expect(res.status).toStrictEqual(400);
  });

  test('Failure - booking across midnight', async () => {
    // Assumes that the base time is 12PM (which it is)
    const res = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(11 * 60),
      minutesFromBase(13 * 60),
      'fun times',
    );
    expect(res.status).toStrictEqual(400);
  });

  test('Success - booking until midnight', async () => {
    const res = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(11 * 60),
      minutesFromBase(12 * 60),
      'fun times',
    );
    expect(res.status).toStrictEqual(200);
  });

  test('Failure - booking far in the future', async () => {
    const res = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(60 * 24 * 60),
      minutesFromBase(60 * 24 * 60 + 60),
      'fun times',
    );
    expect(res.status).toStrictEqual(400);
  });
});
