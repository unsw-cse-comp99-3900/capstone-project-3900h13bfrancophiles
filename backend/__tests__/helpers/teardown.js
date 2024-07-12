import { execSync } from 'child_process';
import * as fs from 'fs';

module.exports = async function (globalConfig, projectConfig) {
  // Kill backend server
  process.kill(globalThis.__server__.pid, 'SIGTERM');
  console.log("Closed backend server - logs available in __tests__/server.log");

  fs.fdatasyncSync(globalThis.__out__);
  fs.fdatasyncSync(globalThis.__err__);
  console.log(fs.readFileSync('./__tests__/server.log', 'utf8'))

  // execSync("./__tests__/helpers/db_teardown.sh");
};