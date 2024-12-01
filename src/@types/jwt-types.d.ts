import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      role: 'TECH' | 'ADMIN' | 'SUPERVISOR';
      sub: string;
    };
  }
}
