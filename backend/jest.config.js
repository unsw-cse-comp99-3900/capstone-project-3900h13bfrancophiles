module.exports = {
  globalSetup: "<rootDir>/__tests__/helpers/setup.js",
  globalTeardown: "<rootDir>/__tests__/helpers/teardown.js",
  setupFilesAfterEnv: ["<rootDir>/__tests__/helpers/globals.js"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/__tests__/helpers/",
  ],
};
