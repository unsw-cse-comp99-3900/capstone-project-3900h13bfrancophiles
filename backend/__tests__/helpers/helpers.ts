
export async function mockCurrentTime(date: Date) {
  await globalThis.__pgclient__.query(`
    INSERT INTO config (key, value) 
    VALUES ('current_timestamp', '${date.toISOString()}')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  `);
}