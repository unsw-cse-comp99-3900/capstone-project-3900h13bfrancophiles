import { BASE_TIME } from './constants';
import { mockCurrentTime } from './helpers';

global.beforeEach(async () => {
  await globalThis.__pgclient__.query("TRUNCATE TABLE booking;")
  await mockCurrentTime(BASE_TIME);
});
