const uuid = require('uuid')
const Redis = require('ioredis')
const { shouldUseSharedDBForAllJestWorkers } = require('../src/utils')

describe('parallelism: second worker', () => {
  let redis
  let url = global.__REDIS_URL__

  beforeAll(async () => {
    redis = new Redis(url)
  })

  afterAll(async () => {
    await redis.disconnect()
  })

  it('Should have a separate instance', async () => {
    await Promise.all([
      redis.set(uuid.v4(), uuid.v4()),
      redis.set(uuid.v4(), uuid.v4()),
    ])

    if (!shouldUseSharedDBForAllJestWorkers()) {
      const keys = await redis.keys('*')
      expect(keys.length).toBe(2)
    }
  })
})
