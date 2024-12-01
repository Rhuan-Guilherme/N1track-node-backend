import fastify from 'fastify';
import { env } from './env';
import { userRoutes } from './http/controllers/user/routes';
import fastifyJwt from '@fastify/jwt';

const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);

app.get('/', (_, reply) => {
  return reply.send('API in running! 🚀');
});
app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server is running http://localhost:' + env.PORT));
