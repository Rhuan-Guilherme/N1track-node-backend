import fastify from 'fastify';
import { env } from './env';
import { userRoutes } from './http/controllers/user/routes';

const app = fastify();

app.register(userRoutes);

app.get('/', (request, reply) => {
  return reply.send('API in running! 🚀');
});
app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server is running http://localhost:' + env.PORT));
