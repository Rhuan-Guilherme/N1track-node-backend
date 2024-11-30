import fastify from 'fastify';

const app = fastify();

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server is running http://localhost:3333'));
