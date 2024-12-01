import { InvalidCredentilsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticate } from '@/use-cases/factories/make-authenticate';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userAuthenticateRequest = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = userAuthenticateRequest.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticate();
    const { user } = await authenticateUseCase.execute({ email, password });
    return reply
      .status(200)
      .send({ ...user, password_hash: null, created_at: null });
  } catch (error) {
    if (error instanceof InvalidCredentilsError) {
      return reply.status(401).send({ message: error.message });
    }
  }
}
