import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  ANONYMOUS_RESPONSE_SECRET: z.string().min(32),
  ANONYMOUS_RESPONSE_WINDOW_HOURS: z.coerce.number().positive().default(24),
  PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:3333'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().positive().default(5),
  RATE_LIMIT_LOGIN_WINDOW: z.string().default('1 minute'),
  RATE_LIMIT_REFRESH_MAX: z.coerce.number().positive().default(10),
  RATE_LIMIT_REFRESH_WINDOW: z.string().default('1 minute'),
  ARGON2_MEMORY_COST: z.coerce.number().positive().default(65536),
  ARGON2_TIME_COST: z.coerce.number().positive().default(3),
  ARGON2_PARALLELISM: z.coerce.number().positive().default(1),
});

export const env = schema.parse(process.env);
export type Env = typeof env;
