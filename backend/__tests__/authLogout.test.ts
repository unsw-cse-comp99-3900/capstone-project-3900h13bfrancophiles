import api from './helpers/api';
import { ADMINS } from './helpers/constants';

describe('/auth/logout', () => {
  test('Success', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    const token = res.json.token;

    res = await api.logout(token);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({});

    // Shouldn't work, because now logged out
    res = await api.logout(token);
    expect(res.status).toStrictEqual(401);
  });

  test('Error - invalid token', async () => {
    const res = await api.logout('NOT A REAL TOKEN');
    expect(res.status).toStrictEqual(401);
  });
});
