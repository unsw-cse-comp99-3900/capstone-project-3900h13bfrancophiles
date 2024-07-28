import { BASE_TIME } from './constants';

export async function mockCurrentTime(date: Date) {
  await globalThis.__pgclient__.query(`
    INSERT INTO config (key, value, description)
    VALUES ('current_timestamp', '${date.toISOString()}', 'Mocks the current timestamp')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  `);
}

export function minutesFromBase(minutes: number) {
  const res = new Date(BASE_TIME);
  res.setMinutes(res.getMinutes() + minutes);
  return res;
}
