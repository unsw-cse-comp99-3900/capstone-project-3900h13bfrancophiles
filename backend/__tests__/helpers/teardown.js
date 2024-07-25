import * as fs from 'fs';

module.exports = async function (globalConfig, projectConfig) {
  // Kill backend server
  globalThis.__server__.kill('SIGTERM');
  fs.close(globalThis.__out__);
  fs.close(globalThis.__err__);
  console.log('Server logs available at ./__tests__/server.log');
  console.log('Coverage report available at ./coverage/index.html');
  console.log('Closing backend server...');

  // Close db
  await globalThis.__pgclient__.end();
};
