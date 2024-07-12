import { spawn } from 'child_process';
import { configDotenv } from 'dotenv';
import * as fs from 'fs';
import { execSync } from 'node:child_process';
import { Client } from 'pg';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = async function (globalConfig, projectConfig) {
  configDotenv({ path: ".env.test" });

  // Create test database
  const init_client = new Client({
    connectionString: process.env.DATABASE_URL.replace("3900-test", "postgres"),
  });
  await init_client.connect();
  await init_client.query(`DROP DATABASE IF EXISTS "3900-test";`);
  await init_client.query(`CREATE DATABASE "3900-test";`);
  await init_client.end();

  // Initial database with schema and dummy data
  globalThis.__pgclient__ = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await globalThis.__pgclient__.connect();
  await globalThis.__pgclient__.query(fs.readFileSync("../postgres/01_init.sql", "utf8"));
  await globalThis.__pgclient__.query(fs.readFileSync("__tests__/helpers/test.init.sql", "utf8"));

  const out = fs.openSync(`./__tests__/server.log`, 'w');
  const err = fs.openSync(`./__tests__/server.log`, 'a');
  globalThis.__out__ = out;
  globalThis.__err__ = err;

  console.log("\nStarting backend server...");
  try {
    // Make sure port 2001 is free
    execSync("kill $(lsof -t -i:2001)", { stdio: 'ignore' });
  } catch (e) {}
  globalThis.__server__ = spawn(
    'yarn', ['dev', '-q'],
    { stdio: ['ignore', out, err] }
  );

  // Wait for it to start up
  for (let i = 0; i < 10; i++) {
    await sleep(1000);
    fs.fdatasyncSync(globalThis.__out__);
    const log = fs.readFileSync(`./__tests__/server.log`, "utf8");
    if (log.includes("Server is running")) break;
  }
};