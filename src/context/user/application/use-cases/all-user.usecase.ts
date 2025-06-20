import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../domain/ports/user-repository';

@injectable()
export class AllUserUseCase {
  constructor(@inject('UserRepository') private userRepo: UserRepository) {}

  async execute() {
    const users = await this.userRepo.all();
    return users;
  }
}
