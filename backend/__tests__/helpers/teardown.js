import * as fs from 'fs';

module.exports = async function (globalConfig, projectConfig) {
  // Kill backend server
  process.kill(globalThis.__server__.pid, 'SIGTERM');
  fs.close(globalThis.__out__);
  fs.close(globalThis.__err__);
  console.log("Closed backend server - logs available in __tests__/server.log");

  // Close db
  await globalThis.__pgclient__.end();
};