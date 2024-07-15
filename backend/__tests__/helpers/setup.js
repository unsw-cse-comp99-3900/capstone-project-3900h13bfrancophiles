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
  const dbName = process.env.DATABASE_URL.split("/")[3];
  const initClient = new Client({
    connectionString: process.env.DATABASE_URL.replace(dbName, "postgres"),
  });
  await initClient.connect();
  await initClient.query(`DROP DATABASE IF EXISTS "${dbName}";`);
  await initClient.query(`CREATE DATABASE "${dbName}";`);
  await initClient.end();

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
    execSync(`kill $(lsof -t -i:${process.env.PORT || 2000})`, { stdio: 'ignore' });
  } catch (e) {}
  globalThis.__server__ = spawn(
    'nyc', ['--reporter=cobertura', '--reporter=html', 'ts-node', 'src/index.ts'],
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