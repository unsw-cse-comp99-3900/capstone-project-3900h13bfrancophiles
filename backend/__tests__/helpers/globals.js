global.beforeEach(async () => {
  await globalThis.__pgclient__.query("TRUNCATE TABLE booking;")
});
