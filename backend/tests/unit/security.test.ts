import { expect, test } from 'bun:test';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/survey';
process.env.JWT_ACCESS_SECRET ??= 'a'.repeat(32);
process.env.JWT_REFRESH_SECRET ??= 'b'.repeat(32);
process.env.ANONYMOUS_RESPONSE_SECRET ??= 'c'.repeat(32);
const { hashPassword, verifyPassword, anonymousFingerprint } = await import('../../src/lib/security.js');

test('hashes and verifies passwords with Argon2id', async () => { const hash = await hashPassword('correct horse battery staple'); expect(hash).toContain('$argon2id$'); expect(await verifyPassword(hash, 'correct horse battery staple')).toBe(true); expect(await verifyPassword(hash, 'wrong')).toBe(false); });
test('fingerprint is deterministic without storing raw IP', () => { const a = anonymousFingerprint('slug', '127.0.0.1', 'browser', 100); expect(a).toHaveLength(64); expect(a).toBe(anonymousFingerprint('slug', '127.0.0.1', 'browser', 100)); expect(a).not.toContain('127.0.0.1'); expect(a).not.toBe(anonymousFingerprint('slug', '127.0.0.2', 'browser', 100)); });
