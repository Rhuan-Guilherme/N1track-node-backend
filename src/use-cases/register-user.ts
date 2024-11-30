import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const findEmailAlreadyExists = await this.userRepository.findByEmail(email);

    if (findEmailAlreadyExists) {
      throw new Error('ja existe');
    }

    const password_hash = await hash(password, 6);

    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    });

    return {
      user,
    };
  }
}
