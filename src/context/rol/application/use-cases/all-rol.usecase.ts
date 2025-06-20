import { inject, injectable } from 'tsyringe';
import { RolRepository } from '../../domain/ports/rol.repository';

@injectable()
export class AllRolUseCase {
  constructor(
    @inject('RolRepository') private readonly rolRepo: RolRepository,
  ) {}

  async execute() {
    const roles = await this.rolRepo.all();
    return roles;
  }
}
