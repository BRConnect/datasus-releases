import { expect, test } from 'bun:test';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/survey';
process.env.JWT_ACCESS_SECRET ??= 'a'.repeat(32);
process.env.JWT_REFRESH_SECRET ??= 'b'.repeat(32);
process.env.ANONYMOUS_RESPONSE_SECRET ??= 'c'.repeat(32);
const { buildApp } = await import('../../src/http/app.js');

test('GET /health returns the public contract', async () => { const app = buildApp(); const response = await app.inject({ method: 'GET', url: '/health' }); expect(response.statusCode).toBe(200); expect(response.json() as any).toEqual({ data: { status: 200, code: 'HELTING TEST OK', message: 'API ON' } }); await app.close(); });
