import argon2 from 'argon2';
import { createHmac, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';

const accessKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshKey = new TextEncoder().encode(env.JWT_REFRESH_SECRET);
const duration = (value: string) => /^([0-9]+)([smhd])$/.exec(value);
const toSeconds = (value: string) => { const m = duration(value); if (!m) return 900; const n = Number(m[1]); return n * ({ s: 1, m: 60, h: 3600, d: 86400 } as Record<string, number>)[m[2]]; };

export const hashPassword = (value: string) => argon2.hash(value, { type: argon2.argon2id, memoryCost: env.ARGON2_MEMORY_COST, timeCost: env.ARGON2_TIME_COST, parallelism: env.ARGON2_PARALLELISM });
export const verifyPassword = (hash: string, value: string) => argon2.verify(hash, value);
export const hashToken = (value: string) => createHmac('sha256', env.JWT_REFRESH_SECRET).update(value).digest('hex');
export const newRefreshToken = () => randomBytes(48).toString('base64url');
export const anonymousFingerprint = (slug: string, ip: string, userAgent: string, window: number) => createHmac('sha256', env.ANONYMOUS_RESPONSE_SECRET).update(`${slug}|${ip}|${userAgent}|${window}`).digest('hex');

export async function createAccessToken(claims: { sub: string; tenantId: string; role: string }) { return new SignJWT({ ...claims, type: 'access' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${toSeconds(env.JWT_ACCESS_EXPIRES_IN)}s`).sign(accessKey); }
export async function createRefreshJwt(claims: { sub: string; tenantId: string; role: string; jti: string }) { return new SignJWT({ ...claims, type: 'refresh' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${toSeconds(env.JWT_REFRESH_EXPIRES_IN)}s`).sign(refreshKey); }
export async function verifyAccessToken(token: string) { const { payload } = await jwtVerify(token, accessKey); if (payload.type !== 'access' || typeof payload.sub !== 'string' || typeof payload.tenantId !== 'string') throw new Error('invalid token'); return payload as { sub: string; tenantId: string; role: string; type: 'access' }; }
export async function verifyRefreshJwt(token: string) { const { payload } = await jwtVerify(token, refreshKey); if (payload.type !== 'refresh' || typeof payload.sub !== 'string' || typeof payload.tenantId !== 'string' || typeof payload.jti !== 'string') throw new Error('invalid token'); return payload as { sub: string; tenantId: string; role: string; jti: string; type: 'refresh' }; }
