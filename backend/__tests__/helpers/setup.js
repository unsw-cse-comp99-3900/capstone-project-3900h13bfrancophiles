import { spawn, execSync } from 'child_process';
import * as fs from 'fs';



function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = async function (globalConfig, projectConfig) {
  // Set up database
  execSync("./__tests__/helpers/db_setup.sh");

  console.log("\nStarting backend server...");
  fs.truncateSync(`./__tests__/server.log`);
  const out = fs.openSync(`./__tests__/server.log`, 'a');
  const err = fs.openSync(`./__tests__/server.log`, 'a');
  const server = spawn(
    'yarn', ['dev', '-q'],
    { stdio: ['ignore', out, err] }
  );
  await sleep(3000);

  globalThis.__server__ = server;
};