module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    setupFiles: ["<rootDir>/test/utils/mocks/mock.env.ts"]
};