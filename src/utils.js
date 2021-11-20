const { resolve } = require('path')

const cwd = process.cwd()

module.exports.getRedisMemoryOptions = () => {
  try {
    const { redisMemoryServerOptions } = require(resolve(cwd, 'jest-redis.config.js'))

    return redisMemoryServerOptions
  } catch (err) {
    return {
      redisMemoryServerOptions: {},
      redisURLEnvName: 'REDIS_URL',
    }
  }
}

module.exports.getRedisURLEnvName = () => {
  try {
    const { redisURLEnvName } = require(resolve(cwd, 'jest-redis.config.js'))

    return redisURLEnvName || 'REDIS_URL'
  } catch (err) {
    return 'REDIS_URL'
  }
}

module.exports.shouldUseSharedDBForAllJestWorkers = () => {
  try {
    const { useSharedDBForAllJestWorkers } = require(resolve(cwd, 'jest-redis.config.js'))

    return useSharedDBForAllJestWorkers === undefined ? true : useSharedDBForAllJestWorkers
  } catch (error) {
    return true
  }
}
