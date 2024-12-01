import { FastifyInstance } from 'fastify';
import { register } from './register-user';
import { authenticate } from './authenticate';

export async function userRoutes(app: FastifyInstance) {
  app.post('/user/register', register);
  app.post('/user/session', authenticate);
}
