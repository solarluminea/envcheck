export type EnvType = 'string' | 'number' | 'boolean' | 'url' | 'email' | 'port' | 'json';

export interface EnvOptions<T = any> {
  type?: EnvType;
  required?: boolean;
  default?: T;
  choices?: T[];
}

export function env<T = string>(name: string, opts?: EnvOptions<T>): T;
export function envSchema<T extends Record<string, any>>(
  schema: Record<keyof T, EnvOptions>
): T;
