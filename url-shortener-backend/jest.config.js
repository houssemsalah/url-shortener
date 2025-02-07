module.exports = {
  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      useBabelrc: true,
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    },
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  setupFiles: ['reflect-metadata'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};
