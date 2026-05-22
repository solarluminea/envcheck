'use strict';

/**
 * env-type-check
 * Zero-dependency runtime type checking for environment variables.
 */

const VALIDATORS = {
  string: (v) => typeof v === 'string',
  number: (v) => !isNaN(Number(v)) && v.trim() !== '',
  boolean: (v) => v === 'true' || v === 'false' || v === '1' || v === '0',
  url: (v) => { try { new URL(v); return true; } catch { return false; } },
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  port: (v) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 65535; },
  json: (v) => { try { JSON.parse(v); return true; } catch { return false; } },
};

const PARSERS = {
  string: (v) => v,
  number: (v) => Number(v),
  boolean: (v) => v === 'true' || v === '1',
  url: (v) => v,
  email: (v) => v,
  port: (v) => Number(v),
  json: (v) => JSON.parse(v),
};

/**
 * Get and validate a single environment variable.
 * @param {string} name - Variable name
 * @param {{ type?: string, required?: boolean, default?: any, choices?: any[] }} opts
 */
function env(name, opts = {}) {
  const { type = 'string', required = true, default: def, choices } = opts;
  const raw = process.env[name];

  if (raw === undefined || raw === '') {
    if (!required) return def !== undefined ? def : undefined;
    if (def !== undefined) return def;
    throw new Error(`[env-type-check] Missing required env var: ${name}`);
  }

  const validator = VALIDATORS[type];
  if (!validator) throw new Error(`[env-type-check] Unknown type: ${type}`);
  if (!validator(raw)) {
    throw new Error(`[env-type-check] Env var ${name}="${raw}" failed type check: expected ${type}`);
  }

  const parsed = PARSERS[type](raw);

  if (choices && !choices.includes(parsed)) {
    throw new Error(`[env-type-check] Env var ${name}="${parsed}" must be one of: ${choices.join(', ')}`);
  }

  return parsed;
}

/**
 * Validate multiple env vars at once.
 * @param {Record<string, { type?: string, required?: boolean, default?: any, choices?: any[] }>} schema
 * @returns {Record<string, any>}
 */
function envSchema(schema) {
  const errors = [];
  const result = {};

  for (const [name, opts] of Object.entries(schema)) {
    try {
      result[name] = env(name, opts);
    } catch (e) {
      errors.push(e.message);
    }
  }

  if (errors.length > 0) {
    throw new Error(`[env-type-check] Validation failed:\n${errors.join('\n')}`);
  }

  return result;
}

module.exports = { env, envSchema };
