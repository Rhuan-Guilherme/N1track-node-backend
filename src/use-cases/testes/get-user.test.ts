import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { test, describe, beforeEach, expect } from 'vitest';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { Authenticate } from '../authenticate';
import { hash } from 'bcryptjs';
import { GetUser } from '../get-user';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let userRepository: UserRepositoryInterface;
let getUserUseCase: GetUser;

describe('Teste para resgatar usuários.', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUserUseCase = new GetUser(userRepository);
  });

  test('Deve ser possível resgatar um usuário pelo ID.', async () => {
    const createdUser = await userRepository.create({
      email: 'fulano@gmail.com',
      name: 'Fulano',
      password_hash: await hash('123456', 6),
    });

    const { user } = await getUserUseCase.execute({
      id: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toEqual('fulano@gmail.com');
  });

  test('Não deve ser possível resgatar um usuário com um ID inválido.', async () => {
    const createdUser = await userRepository.create({
      email: 'fulano@gmail.com',
      name: 'Fulano',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      getUserUseCase.execute({
        id: 'invalid-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
