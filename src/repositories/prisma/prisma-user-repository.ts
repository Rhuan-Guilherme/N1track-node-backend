import { User, Prisma } from '@prisma/client';
import { UserRepositoryInterface } from '../user-repository-interface';
import { prisma } from '@/lib/prisma';

export class PrismaUserRepository implements UserRepositoryInterface {
  async findById(id: string): Promise<User | null> {
    const user = prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = prisma.user.create({ data });

    return user;
  }
}
