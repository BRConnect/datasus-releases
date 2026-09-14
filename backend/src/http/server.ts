import { buildApp } from './app.js';
import { env } from '../config/env.js';

const app = buildApp();
await app.listen({ host: env.HOST, port: env.PORT });
const shutdown = async (signal: string) => { app.log.info({ signal }, 'shutting down'); await app.close(); process.exit(0); };
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
