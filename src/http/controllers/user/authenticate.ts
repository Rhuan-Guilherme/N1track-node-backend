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

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return reply.status(200).send({ token: token });
  } catch (error) {
    if (error instanceof InvalidCredentilsError) {
      return reply.status(401).send({ message: error.message });
    }
  }
}
