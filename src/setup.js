const fs = require('fs')
const { join } = require('path')
const { RedisMemoryServer } = require('redis-memory-server')
const { getRedisMemoryOptions, getRedisURLEnvName, shouldUseSharedDBForAllJestWorkers } = require('./utils')

const debug = require('debug')('jest-redis:setup')
const redisServer = new RedisMemoryServer(getRedisMemoryOptions())

const cwd = process.cwd()
const redisGlobalsPath = join(cwd, 'redisGlobals.json')

module.exports = async () => {
  const redisConfig = {}

  debug(`shouldUseSharedDBForAllJestWorkers: ${shouldUseSharedDBForAllJestWorkers()}`)

  if (shouldUseSharedDBForAllJestWorkers()) {
    if (!redisServer.getInstanceInfo()) {
      await redisServer.start()
    }

    const host = await redisServer.getHost()
    const port = await redisServer.getPort()
    redisConfig.redisUrl = `redis://${host}:${port}`
    process.env[getRedisURLEnvName()] = redisConfig.redisUrl

    // set reference to redis server instance to close the server in teardown
    global.__REDIS__ = redisServer
  }

  // write global config because each test runs in a different context
  fs.writeFileSync(redisGlobalsPath, JSON.stringify(redisConfig, null, 2))
  debug(`wrote redis globals to ${redisGlobalsPath}`)
}
