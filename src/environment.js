const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const NodeEnvironment = require('jest-environment-node')
const { RedisMemoryServer } = require('redis-memory-server')
const { getRedisMemoryOptions } = require('./utils')

const debug = require('debug')('jest-redis:environment')

const cwd = process.cwd()

const redisConfigPath = path.join(cwd, 'redisGlobals.json')

const redisServer = new RedisMemoryServer(getRedisMemoryOptions())

module.exports = class RedisEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    debug('setup redis test environment')

    const globalConfig = JSON.parse(fs.readFileSync(redisConfigPath, 'utf-8'))

    if (globalConfig.redisUrl) {
      this.global.__REDIS_URL__ = globalConfig.redisUrl
    } else {
      await redisServer.connect()

      this.global.__REDIS_URL__ = await redisServer.getRedisUrl()
    }

    await super.setup()
  }

  async teardown() {
    debug('teardown redis test environment')

    await redisServer.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}
