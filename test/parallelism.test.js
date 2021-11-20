const uuid = require('uuid')
const Redis = require('ioredis')
const { shouldUseSharedDBForAllJestWorkers } = require('../src/utils')

describe('parallelism: first worker', () => {
  let redis
  let url = global.__REDIS_URL__

  beforeAll(async () => {
    redis = new Redis(url)
  })

  afterAll(async () => {
    await redis.disconnect()
  })

  it('Should have a separate instance', async () => {
    const result = await redis.set(uuid.v4(), uuid.v4())
    expect(result).toBe('OK')

    if (!shouldUseSharedDBForAllJestWorkers()) {
      const keys = await redis.keys('*')
      expect(keys.length).toBe(1)
    }
  })
})
