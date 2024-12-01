import { UserRepositoryInterface } from '@/repositories/user-repository-interface';
import { InvalidCredentilsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User;
}

export class Authenticate {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentilsError();
    }

    const passwordCorrect = await compare(password, user.password_hash);

    if (!passwordCorrect) {
      throw new InvalidCredentilsError();
    }

    return {
      user,
    };
  }
}
