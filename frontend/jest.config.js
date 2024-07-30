module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    },
    testEnvironment: "jsdom"
};
