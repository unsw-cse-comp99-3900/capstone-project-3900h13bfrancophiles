import api from './helpers/api';
import { ADMINS, ROOM, DESK } from './helpers/constants';

describe('/spaces', () => {
  test('get information for all spaces', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.spaces(token);
    const spaces = res.json.spaces;

    expect(res.status).toStrictEqual(200);
    expect(res.json.spaces).toBeDefined()
    for (const room of ROOM) {
      expect(res.json.spaces).toContainEqual({
        "id": room.id,
        "isRoom": true,
        "name": room.name,
      })
    }
    for (const desk of DESK) {
      expect(res.json.spaces).toContainEqual({
        "id": desk.id,
        "isRoom": false,
        "name": desk.name,
      })
    }
  });
});
