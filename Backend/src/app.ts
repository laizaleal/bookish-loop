import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import env from './config/env';
import registerRoutes from './routes';
import { authGuard } from './middlewares/auth';
import { registerErrorHandler } from './middlewares/error';

export function buildApp() {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: env.corsOrigin, credentials: true });
  app.register(helmet);
  app.register(sensible);

  // decoradores (middlewares)
  app.decorate('authGuard', authGuard);

  // healthcheck
  app.get('/health', async () => ({ ok: true }));

  // rotas
  app.register(registerRoutes);

  // error handler global
  registerErrorHandler(app);

  return app;
}

// Tipagem do decorator
declare module 'fastify' {
  interface FastifyInstance {
    authGuard: any;
  }
}
