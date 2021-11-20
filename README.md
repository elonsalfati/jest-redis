# jest-redis
Jest preset for Redis in-memory server

# Usage
## 1. Install
```sh-session
$ yarn add redis-memory-server jest-redis --dev
```

## 2. Create a `jest.config.js` file
```javascript
module.exports = {
	preset: 'jest-redis',
}
```

## 3. Customizing Redis Server, create a `jest-redis.config.js`
See [redis-memory-server](https://github.com/mhassan1/redis-memory-server#available-options-for-redismemoryserver) to learn more about the optional configuraitons.

```javascript
module.exports = {
	redisMemoryServerOptions: {
		instance: {
			port: number, // by default, choose any free port
			ip: string, // by default, '127.0.0.1'; for binding to all IP addresses set it to `::,0.0.0.0`,
			args: [], // by default, no additional arguments; any additional command line arguments for `redis-server`
		},
		binary: {
			version: string, // by default, 'stable'
			downloadDir: string, // by default, 'node_modules/.cache/redis-memory-server/redis-binaries'
			systemBinary: string, // by default, undefined
		},
		autoStart: boolean, // by default, true
	},
	useSharedDBForAllJestWorkers: boolean, // enables seperated database for each test worker. This disables the exported environment variable.
	redisURLEnvName: string, // the exported environment variable name
}
```

## 4. Configure Redis Client
This library sets the `process.env[options.redisURLEnvName]` (by default `process.env.REDIS_URL`) for your convenience. However, it's preferable to use `global.__REDIS_URL__` as is works with `useSharedDBForAllJestWorkers`.

```javascript
const Redis = require('ioredis')

describe('set', () => {
	let client

	beforeAll(async () => {
		client = new Redis(global.__REDIS_URL__)
		await client.connect()
	})

	afterAll(async () => {
		await client.disconnect()
	})
})
```

### Jest watch mode
This package creates the file `redisGlobals.json` in the project root when using jest `--watch` flag. Changes to this file can cause issues.
In order to avoid unwanted behaviour, add the `redisGlobals.json` to your ignore files and in `jest.config.js`, add:

```javascript
// jest.config.js
module.exports = {
	watchPathIgnorePatterns: ['redisGlobals']
}
```
