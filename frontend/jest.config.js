// module.exports = {
//     preset: "ts-jest",
//     testEnvironment: "jsdom",
//     setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
//     moduleNameMapper: {
//       "^@/(.*)$": "<rootDir>/src/$1"
//     },
//     transform: {
//         "^.+\\.tsx?$": "ts-jest"
//     },
// };
const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
