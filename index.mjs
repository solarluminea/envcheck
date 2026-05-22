import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { env, envSchema } = require('./index.js');
export { env, envSchema };
