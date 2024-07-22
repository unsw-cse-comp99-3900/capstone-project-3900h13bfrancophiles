import { ADMINS } from './helpers/constants';
import api from './helpers/api';

describe('/auth/login', () => {
  test('Success', async () => {
    const res = await api.login(`z${ADMINS[0].zid}`, `z${ADMINS[0].zid}`);
    expect(res.status).toStrictEqual(200);
    expect(res.json).toMatchObject({
      token: expect.any(String),
    });
  });

  test('Error - invalid zid', async () => {
    let res = await api.login('not a zid', 'not a zid');
    expect(res.status).toStrictEqual(400);

    res = await api.login('z0000000', 'z0000000');
    expect(res.status).toStrictEqual(400);
  });

  test('Error - invalid password', async () => {
    let res = await api.login(`z${ADMINS[0].zid}`, undefined);
    expect(res.status).toStrictEqual(400);

    res = await api.login(`z${ADMINS[0].zid}`, 'password');
    expect(res.status).toStrictEqual(400);
  });
});
