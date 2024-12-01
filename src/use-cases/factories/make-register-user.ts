import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { RegisterUser } from '../register-user';

export function makeRegisterUser() {
  const userRepository = new PrismaUserRepository();
  const registerUserUseCase = new RegisterUser(userRepository);

  return registerUserUseCase;
}
