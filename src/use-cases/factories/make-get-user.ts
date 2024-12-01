import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { GetUser } from '../get-user';

export function makeGetUser() {
  const userRepository = new PrismaUserRepository();
  const getUserUseCase = new GetUser(userRepository);

  return getUserUseCase;
}
