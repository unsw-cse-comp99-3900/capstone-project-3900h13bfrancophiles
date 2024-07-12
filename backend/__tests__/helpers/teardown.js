import { execSync } from 'child_process';

module.exports = async function (globalConfig, projectConfig) {
  // Kill backend server
  process.kill(globalThis.__server__.pid, 'SIGTERM');

  execSync("./__tests__/helpers/db_teardown.sh");
};