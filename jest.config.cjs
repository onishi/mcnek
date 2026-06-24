module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^virtual:pwa-register/react$":
      "<rootDir>/tests/mocks/virtualPwaRegisterReact.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
