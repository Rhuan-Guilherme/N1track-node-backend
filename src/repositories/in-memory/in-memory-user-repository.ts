import { User, Prisma, $Enums } from '@prisma/client';
import { UserRepositoryInterface } from '../user-repository-interface';
import { randomUUID } from 'crypto';

export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: $Enums.Role.TECH,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }
}
