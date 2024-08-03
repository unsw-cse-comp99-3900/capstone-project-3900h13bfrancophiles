import api from "./helpers/api";
import { DESK, HDR, ADMINS, ROOM } from "./helpers/constants";
import { minutesFromBase } from "./helpers/helpers";

describe("/bookings/edit", () => {
  let token: string;

  beforeEach(async () => {
    const res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res.json.token;
  });

  test("Failure - Invalid input", async () => {
    const res = await api.apiCall("/bookings/edit", "PUT", { input: "invalid" }, token);
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

  test("Success - declined booking is edited", async () => {
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

    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const admintoken = res1.json.token;

    await api.declineBooking(admintoken, booking.id);

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
    const initialBooking = {
      zid: HDR[0].zid,
      starttime: minutesFromBase(15).toISOString(),
      endtime: minutesFromBase(45).toISOString(),
      spaceid: DESK[0].id,
      currentstatus: "confirmed",
      description: "fun times",
    };
    const editedBooking = {
      zid: HDR[0].zid,
      starttime: minutesFromBase(15).toISOString(),
      endtime: minutesFromBase(45).toISOString(),
      spaceid: DESK[0].id,
      currentstatus: "confirmed",
      description: "I edited this booking!",
    };

    const res = await api.createBooking(
      token,
      DESK[0].id,
      minutesFromBase(15),
      minutesFromBase(45),
      "fun times",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: initialBooking,
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
      booking: editedBooking,
    });
  });

  test("Failure - pending edited to space with no permissions", async () => {
    const res1 = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    token = res1.json.token;

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
    const res2 = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      ROOM[1].id,
      "I edited this booking!",
    );
    expect(res2.status).toStrictEqual(403);
  });

  test("Success - approved booking is edited", async () => {
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
    const res1 = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const admintoken = res1.json.token;

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

    const res3 = await api.upcomingBookings(token);
    expect(res3.status).toStrictEqual(200);

    expect(res3.json.bookings[0]).toMatchObject(initialBooking);
    expect(res3.json.bookings[1]).toMatchObject(editedBooking);
  });

  test("Success - modifying parent should always modify child", async () => {
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
    let res = await api.createBooking(
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
    res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const admintoken = res.json.token;
    initialBooking.currentstatus = "confirmed";

    await api.approveBooking(admintoken, booking.id);

    // User edits booking
    res = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking!",
    );
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: editedBooking,
    });

    res = await api.upcomingBookings(token);
    expect(res.status).toStrictEqual(200);

    expect(res.json.bookings[0]).toMatchObject(initialBooking);
    expect(res.json.bookings[1]).toMatchObject(editedBooking);

    // User edits parent booking, which should modify the child instead
    res = await api.editBooking(
      token,
      booking.id,
      booking.starttime,
      booking.endtime,
      booking.spaceid,
      "I edited this booking AGAIN!",
    );
    editedBooking.description = "I edited this booking AGAIN!";
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      booking: editedBooking,
    });

    res = await api.upcomingBookings(token);
    expect(res.status).toStrictEqual(200);

    expect(res.json.bookings[0]).toMatchObject(initialBooking);
    expect(res.json.bookings[1]).toMatchObject(editedBooking);
  });
});
