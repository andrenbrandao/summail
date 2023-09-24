/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/config/testing/jest.setup.ts'],
  globalSetup: '<rootDir>/src/config/testing/globalSetup.ts',
  globalTeardown: '<rootDir>/src/config/testing/globalTeardown.ts',
  moduleNameMapper: {
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
  },
  setupFiles: ['<rootDir>/jest.setEnvVars.js'],
};
