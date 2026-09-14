import fp from 'fastify-plugin';
import { verifyAccessToken } from '../../lib/security.js';
import type { Auth, AuthedRequest } from '../types.js';

declare module 'fastify' { interface FastifyRequest { auth?: Auth } }
export default fp(async (app) => {
  app.decorateRequest('auth', undefined);
  app.decorate('authenticate', async (request: AuthedRequest, reply: any) => {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) return reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required', details: [] } });
    try { request.auth = await verifyAccessToken(header.slice(7)); } catch { return reply.code(401).send({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token', details: [] } }); }
  });
  app.decorate('requireRole', (roles: string[]) => async (request: AuthedRequest, reply: any) => { if (!request.auth || !roles.includes(request.auth.role)) return reply.code(403).send({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions', details: [] } }); });
});
