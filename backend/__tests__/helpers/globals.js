import { BASE_TIME } from './constants';
import { mockCurrentTime } from './helpers';

global.beforeEach(async () => {
  await globalThis.__pgclient__.query("TRUNCATE TABLE booking;");
  await globalThis.__pgclient__.query("ALTER SEQUENCE booking_id_seq RESTART;");
  await mockCurrentTime(BASE_TIME);
});
