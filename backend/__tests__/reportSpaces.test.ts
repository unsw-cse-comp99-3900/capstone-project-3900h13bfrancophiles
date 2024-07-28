import api from './helpers/api';
import { ADMINS, DESK, ROOM } from "./helpers/constants";

describe('/admin/reports/spaces', () => {
  test('Success', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.reportSpaces(token);
    expect(res.json).toMatchObject({
      spaces: [
        {
          text: ROOM[1].name,
          value: ROOM[1].id,
          type: "room",
          level: ROOM[1].floor,
        },
        {
          text: DESK[1].roomName,
          value: DESK[1].roomId,
          type: "desk",
          level: ROOM[1].floor,
        },
        {
          text: DESK[0].roomName,
          value: DESK[0].roomId,
          type: "desk",
          level: DESK[0].floor,
        },
        {
          text: ROOM[0].name,
          value: ROOM[0].id,
          type: "room",
          level: ROOM[0].floor,
        },
      ]
    })
  });
});
