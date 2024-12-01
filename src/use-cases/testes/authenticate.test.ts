import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { test, describe, beforeEach, expect } from 'vitest';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { Authenticate } from '../authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentilsError } from '../errors/invalid-credentials-error';

let userRepository: UserRepositoryInterface;
let authenticateUserCase: Authenticate;

describe('Teste para a autenticação de usuários', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    authenticateUserCase = new Authenticate(userRepository);
  });

  test('Deve ser possível autenticar um usuário.', async () => {
    await userRepository.create({
      email: 'fulano@gmail.com',
      name: 'Fulano',
      password_hash: await hash('123456', 6),
    });

    const { user } = await authenticateUserCase.execute({
      email: 'fulano@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toEqual('fulano@gmail.com');
  });

  test('Não deve ser possível se autenticar com um e-mail incorreto.', async () => {
    await expect(() =>
      authenticateUserCase.execute({
        email: 'fulano@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentilsError);
  });

  test('Não deve ser possível se autenticar com uma senha incorreta.', async () => {
    await userRepository.create({
      email: 'fulano@gmail.com',
      name: 'Fulano',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      authenticateUserCase.execute({
        email: 'fulano@gmail.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentilsError);
  });
});
