import { and, eq, isNotNull, lt } from 'drizzle-orm';
import { db, pool } from '../db/client.js';
import { refreshTokens, users } from '../db/schema.js';

const cutoff = new Date(Date.now() - 30 * 86400000);
const deleted = await db.delete(users).where(and(isNotNull(users.deletedAt), lt(users.deletedAt, cutoff))).returning({ id: users.id });
await db.delete(refreshTokens).where(isNotNull(refreshTokens.revokedAt));
console.log(JSON.stringify({ deletedUsers: deleted.length, cutoff: cutoff.toISOString() }));
await pool.end();
