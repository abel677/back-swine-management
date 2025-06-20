import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../domain/ports/user-repository';
import { User } from '../../domain/entities/user.entity';

@injectable()
export class GetUserByEmailUseCase {
  constructor(
    @inject('UserRepository')
    private readonly userRepo: UserRepository,
  ) {}

  async execute(email: string): Promise<User | null> {
    return await this.userRepo.getByEmail(email);
  }
}
