import { FastifyInstance } from 'fastify';
import { register } from './register-user';

export async function userRoutes(app: FastifyInstance) {
  app.post('/user/register', register);
}
