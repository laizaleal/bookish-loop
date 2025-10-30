import { FastifyInstance } from 'fastify';
import { RegisterSchema, LoginSchema } from './auth.schemas';
import { registerService, loginService } from './auth.service';

export default async function authController(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const input = RegisterSchema.parse(req.body);
    const user = await registerService(input);
    return reply.code(201).send(user);
  });

  app.post('/auth/login', async (req, reply) => {
    const input = LoginSchema.parse(req.body);
    const result = await loginService(input);
    return reply.send(result);
  });

  app.get('/auth/me', { preHandler: [app.authGuard] }, async (req: any) => {
    return { user: req.user };
  });
}
