import api from "./helpers/api";
import { ADMINS, ROOM, DESK } from "./helpers/constants";

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

  test("get information for one space", async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.singleSpace(token, ROOM[0].id);
    expect(res.status).toStrictEqual(200);
    expect(res.json.space).toBeDefined();
    expect(res.json.type).toBeDefined();
    expect(res.json.space).toMatchObject(
      {
        id: ROOM[0].id,
        name: ROOM[0].name,
        type: ROOM[0].type,
        capacity: ROOM[0].capacity,
        roomnumber: ROOM[0].roomnumber,
      }
    )
    expect(res.json.type).toEqual("room")
  });

});
