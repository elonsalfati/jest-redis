const uuid = require('uuid')
const Redis = require('ioredis')

describe('set', () => {
  let redis
  const url = global.__REDIS_URL__

  beforeAll(async () => {
    redis = new Redis(url)
  })

  afterAll(async () => {
    await redis.disconnect()
  })

  it('Should set a value to a given key', async () => {
    const key = uuid.v4()
    const value = uuid.v4()

    const result = await redis.set(key, value)
    expect(result).toBe('OK')
  })
})
