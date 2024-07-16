import api from './helpers/api';
import { DESK, HDR, ROOM } from './helpers/constants';
import { minutesFromBase } from './helpers/helpers';

describe("/bookings/create", () => {
  let token: string;

  beforeEach(async () => {
    const res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;
  });

  test("Success - immediately confirmed booking", async () => {
    const res = await api.createBooking(
      token, DESK[0].id, minutesFromBase(15), minutesFromBase(45), "fun times"
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: DESK[0].id,
        currentstatus: "confirmed",
        description: "fun times"
      }
    });
  });

  test("Success - initially pending booking request", async () => {
    const res = await api.createBooking(
      token, ROOM[0].id, minutesFromBase(15), minutesFromBase(45), "fun times"
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times"
      }
    });
  });

  test("Failure - non-existent space", async () => {
    const res = await api.createBooking(
      token, "K-J17-701", minutesFromBase(15), minutesFromBase(45), "fun times"
    );
    expect(res.status).toStrictEqual(404);
  });

  test("Failure - no permission to request space", async () => {
    const res = await api.createBooking(
      token, ROOM[1].id, minutesFromBase(15), minutesFromBase(45), "fun times"
    );
    expect(res.status).toStrictEqual(403);
  });

  test("Failure - time already booked", async () => {
  });

  test("Failure - booking in the past", async () => {
  });

  test("Failure - end not after start", async () => {
  });

  test("Failure - booking not a multiple of 15 minutes", async () => {
  });

  test("Failure - booking not on 15 minute boundaries", async () => {
  });

  test("Failure - booking across midnight", async () => {
  });

  test("Failure - booking far in the future", async () => {
  });
});