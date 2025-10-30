import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyJwt } from '../utils/jwt';

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return reply.code(401).send({ message: 'Token ausente' });
  const token = auth.slice('Bearer '.length);
  try {
    const payload = await verifyJwt(token);
    (req as any).user = payload; // { sub, name, email }
  } catch {
    return reply.code(401).send({ message: 'Token inválido' });
  }
}
