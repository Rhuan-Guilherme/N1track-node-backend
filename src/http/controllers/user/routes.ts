import { FastifyInstance } from 'fastify';
import { register } from './register-user';
import { authenticate } from './authenticate';
import { getUser } from './get-user';
import { verifyJWT } from '@/http/middlewares/verify-jwt';

export async function userRoutes(app: FastifyInstance) {
  app.post('/user/register', register);
  app.post('/user/session', authenticate);
  app.get('/user', { onRequest: [verifyJWT] }, getUser);
}
