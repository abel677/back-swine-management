import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.getById(id);
    if (!user) throw Application.unauthorized();
    return user;
  }
}
