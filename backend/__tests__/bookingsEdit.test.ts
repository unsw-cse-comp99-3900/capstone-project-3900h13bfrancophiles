import api from "./helpers/api";
import { DESK, HDR, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/bookings/edit", () => {
  let token: string;

  beforeEach(async () => {
    const res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;
  });

  test("Failure - Invalid input", async () => {
    let res = await api.apiCall("/bookings/edit", "PUT", { input: "invalid" }, token);
    expect(res.status).toStrictEqual(400);
  });

  test("Failure - User does not have a booking with this id", async () => {
    const res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times",
      },
    });

    const booking = res.json.booking;
    const res1 = await api.editBooking(
      token,
      booking.id + 1,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res1.status).toStrictEqual(404);
  });

  test("Failure - Spaceid not found", async () => {
    const res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times",
      },
    });

    const booking = res.json.booking;
    const res1 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid + 1000,
      "I edited this booking!",
    );
    expect(res1.status).toStrictEqual(404);
  });

  test("Success - pending booking is edited", async () => {
    const res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times",
      },
    });

    const booking = res.json.booking;
    const res1 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toMatchObject({
      booking: {
        id: booking.id,
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "I edited this booking!",
      },
    });
  });

  test("Success - pending booking is edited with no changes  made", async () => {
    const res = await api.createBooking(
      token,
      ROOM[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: "pending",
        description: "fun times",
      },
    });

    const booking = res.json.booking;
    const res1 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      booking.description,
    );
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toMatchObject({
      booking: {
        id: booking.id,
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: ROOM[0].id,
        currentstatus: booking.currentstatus,
        description: booking.description,
      },
    });
  });

  test("Success - confirmed booking is edited", async () => {
    const res = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: {
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: DESK[0].id,
        currentstatus: "confirmed",
        description: "fun times",
      },
    });

    const booking = res.json.booking;
    const res1 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res1.status).toStrictEqual(200);
    expect(res1.json).toMatchObject({
      booking: {
        id: booking.id,
        zid: HDR[0].zid,
        starttime: minutesFromBase(15).toISOString(),
        endtime: minutesFromBase(45).toISOString(),
        spaceid: DESK[0].id,
        currentstatus: "confirmed",
        description: "I edited this booking!",
      },
    });
  });
});
