import api from './helpers/api';
import { ADMINS, ROOM, DESK } from './helpers/constants';

describe('/spaces', () => {
  test('get information for all spaces', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.spaces(token);
    const spaces = res.json.spaces;

    expect(res.status).toStrictEqual(200);
    expect(res.json).toEqual({
      spaces: [
        {
          "id": "K-K17-111",
          "isRoom": true,
          "name": "Room 1",
        },{
          "id": "K-K17-222",
          "isRoom": true,
          "name": "Room 2",
        },{
          "id": "K-K17-333-1",
          "isRoom": false,
          "name": "Desk 1",
        },{
          "id": "K-K17-444-1",
          "isRoom": false,
          "name": "Desk 2",
        }
      ]
    });
  });
});
