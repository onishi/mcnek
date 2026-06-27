module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^virtual:pwa-register/react$":
      "<rootDir>/tests/mocks/virtualPwaRegisterReact.ts",
    "^react-leaflet$": "<rootDir>/tests/mocks/reactLeaflet.tsx",
    "^leaflet$": "<rootDir>/tests/mocks/leaflet.ts",
    "^leaflet/dist/images/(.*)$": "<rootDir>/tests/mocks/leafletImage.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
