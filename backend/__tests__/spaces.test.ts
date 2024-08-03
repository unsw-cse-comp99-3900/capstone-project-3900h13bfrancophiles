import api from "./helpers/api";
import { ADMINS, HDR, STAFF, OTHER, ROOM, DESK } from "./helpers/constants";

describe("/spaces", () => {
  test("get information for all spaces", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.spaces(token);
    expect(res.status).toStrictEqual(200);
    expect(res.json.spaces).toBeDefined();
    for (const room of ROOM) {
      expect(res.json.spaces).toContainEqual({
        id: room.id,
        isRoom: true,
        name: room.name,
      });
    }
    for (const desk of DESK) {
      expect(res.json.spaces).toContainEqual({
        id: desk.id,
        isRoom: false,
        name: desk.name,
      });
    }
  });

  test("get information for all rooms", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.rooms(token);
    expect(res.status).toStrictEqual(200);
    for (const room of ROOM) {
      expect(res.json.rooms).toContainEqual({
        id: room.id,
        name: room.name,
        type: room.type,
        capacity: room.capacity,
        roomnumber: room.roomnumber,
      });
    }
  });

  test("get information for one room", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.singleSpace(token, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json.space).toBeDefined();
    expect(res.json.type).toBeDefined();
    expect(res.json.space).toMatchObject({
      id: ROOM[0].id,
      name: ROOM[0].name,
      type: ROOM[0].type,
      capacity: ROOM[0].capacity,
      roomnumber: ROOM[0].roomnumber,
    });
    expect(res.json.type).toEqual("room");
  });

  test("get information for one desk", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.singleSpace(token, DESK[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json.space).toBeDefined();
    expect(res.json.type).toBeDefined();
    expect(res.json.space).toMatchObject({
      id: DESK[0].id,
      name: DESK[0].name,
      floor: DESK[0].floor,
      xcoord: DESK[0].xcoord,
      ycoord: DESK[0].ycoord,
    });
    expect(res.json.type).toEqual("desk");
  });

  test("check if space is bookable", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const adminToken = res.json.token;
    res = await api.login(`z${HDR[0].zid}`, `z${HDR[0].zid}`);
    const hdrToken = res.json.token;
    res = await api.login(`z${STAFF[0].zid}`, `z${STAFF[0].zid}`);
    const staffToken = res.json.token;
    res = await api.login(`z${OTHER[0].zid}`, `z${OTHER[0].zid}`);
    const otherToken = res.json.token;

    res = await api.bookable(adminToken, DESK[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });
    res = await api.bookable(adminToken, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });

    res = await api.bookable(staffToken, DESK[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });
    res = await api.bookable(staffToken, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });
    res = await api.bookable(staffToken, ROOM[1].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });

    res = await api.bookable(hdrToken, DESK[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });
    res = await api.bookable(hdrToken, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: true });
    res = await api.bookable(hdrToken, ROOM[1].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: false });

    res = await api.bookable(otherToken, DESK[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: false });
    res = await api.bookable(otherToken, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({ canBook: false });
  });
});
