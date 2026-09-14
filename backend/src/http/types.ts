import type { FastifyRequest } from 'fastify';
export type Auth = { sub: string; tenantId: string; role: string; type: 'access' };
export type AuthedRequest = FastifyRequest & { auth: Auth };
export const ok = <T>(data: T, meta?: unknown) => meta === undefined ? { data } : { data, meta };
export const fail = (code: string, message: string, details: unknown[] = []) => ({ error: { code, message, details } });
