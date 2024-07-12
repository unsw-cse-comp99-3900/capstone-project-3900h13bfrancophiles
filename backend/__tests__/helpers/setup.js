import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import { spawnSync } from 'node:child_process';



function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = async function (globalConfig, projectConfig) {
  // Set up database
  spawnSync('createdb', ['3900-test']);
  // execSync("./__tests__/helpers/db_setup.sh");

  console.log("\nStarting backend server...");
  const out = fs.openSync(`./__tests__/server.log`, 'w');
  const err = fs.openSync(`./__tests__/server.log`, 'a');

  const server = spawn(
    'yarn', ['dev', '-q'],
    { stdio: ['ignore', out, err] }
  );
  await sleep(10000);

  globalThis.__out__ = out;
  globalThis.__err__ = err;
  globalThis.__server__ = server;
};