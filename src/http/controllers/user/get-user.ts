import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeGetUser } from '@/use-cases/factories/make-get-user';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserUseCase = makeGetUser();
    const { user } = await getUserUseCase.execute({ id: request.user.sub });
    return reply.status(200).send({ ...user, password_hash: undefined });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
  }
}
