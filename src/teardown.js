const debug = require('debug')('jest-redis:teardown')

module.exports = async () => {
  debug('teardown redis')

  if (global.__REDIS__) {
    await global.__REDIS__.stop()
  }
}
