import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { test, describe, beforeEach, expect } from 'vitest';
import { RegisterUser } from '../register-user';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { compare } from 'bcryptjs';

let userRepository: UserRepositoryInterface;
let userUserCase: RegisterUser;

describe('Teste para o registro de usuário', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userUserCase = new RegisterUser(userRepository);
  });

  test('Deve ser possível criar um novo usuário.', async () => {
    const { user } = await userUserCase.execute({
      email: 'fulano@gmail.com',
      name: 'fulano',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toEqual('fulano@gmail.com');
  });

  test('Não deve ser possível criar um usuário com um e-mail ja cadastrado.', async () => {
    await userUserCase.execute({
      email: 'fulano@gmail.com',
      name: 'fulano',
      password: '123456',
    });

    await expect(() =>
      userUserCase.execute({
        email: 'fulano@gmail.com',
        name: 'fulano',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  test('Deve ser possível que a senha esteja criptografada.', async () => {
    const { user } = await userUserCase.execute({
      email: 'fulano@gmail.com',
      name: 'fulano',
      password: '123456',
    });

    const passwordIsHashed = await compare('123456', user.password_hash);

    expect(passwordIsHashed).toEqual(true);
  });
});
