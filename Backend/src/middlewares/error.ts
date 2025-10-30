import { FastifyInstance } from 'fastify';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, _req, reply) => {
    const status = (err as any).status ?? 500;
    const message = err?.message ?? 'Erro interno';
    reply.code(status).send({ message });
  });
}
