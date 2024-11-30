import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { test, describe, beforeEach, expect } from 'vitest';
import { RegisterUser } from '../register-user';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';

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
});
