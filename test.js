const { env, envSchema } = require('./index.js');
const assert = require('assert');

process.env.TEST_STR = 'hello';
process.env.TEST_NUM = '42';
process.env.TEST_BOOL = 'true';
process.env.TEST_URL = 'https://example.com';
process.env.TEST_PORT = '3000';

assert.strictEqual(env('TEST_STR'), 'hello');
assert.strictEqual(env('TEST_NUM', { type: 'number' }), 42);
assert.strictEqual(env('TEST_BOOL', { type: 'boolean' }), true);
assert.strictEqual(env('TEST_URL', { type: 'url' }), 'https://example.com');
assert.strictEqual(env('TEST_PORT', { type: 'port' }), 3000);
assert.strictEqual(env('MISSING', { required: false, default: 'fallback' }), 'fallback');

const result = envSchema({ TEST_STR: {}, TEST_NUM: { type: 'number' } });
assert.strictEqual(result.TEST_STR, 'hello');
assert.strictEqual(result.TEST_NUM, 42);

console.log('All tests passed ✓');
