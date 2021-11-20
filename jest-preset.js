const { resolve } = require('path')

module.exports = {
  globalSetup: resolve(__dirname, './src/setup.js'),
  globalTeardown: resolve(__dirname, './src/teardown.js'),
  testEnvironment: resolve(__dirname, './src/environment.js'),
}
