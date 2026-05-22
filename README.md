# @solarluminea/envcheck

Zero-dependency runtime type checking and validation for environment variables. Works in Node.js, Bun, and edge runtimes.

## Install

```bash
npm install @solarluminea/envcheck
```

## Usage

```js
const { env, envSchema } = require('@solarluminea/envcheck');

// Single variable
const port = env('PORT', { type: 'port', default: 3000 });
const dbUrl = env('DATABASE_URL', { type: 'url' });
const debug = env('DEBUG', { type: 'boolean', required: false, default: false });

// Full schema validation (throws if any fail)
const config = envSchema({
  PORT:         { type: 'port',    default: 3000 },
  DATABASE_URL: { type: 'url' },
  NODE_ENV:     { type: 'string',  choices: ['development', 'production', 'test'] },
  DEBUG:        { type: 'boolean', required: false, default: false },
});
```

## Supported types

| Type      | Validates                        | Returns         |
|-----------|----------------------------------|-----------------|
| `string`  | any non-empty string             | `string`        |
| `number`  | parseable as a number            | `number`        |
| `boolean` | `true/false/1/0`                 | `boolean`       |
| `url`     | valid URL                        | `string`        |
| `email`   | basic email format               | `string`        |
| `port`    | integer 1–65535                  | `number`        |
| `json`    | valid JSON                       | parsed object   |

## License

MIT
