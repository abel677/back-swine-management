import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';
import { User } from '../../domain/entities/user.entity';
import { ByNamesRolUseCase } from '../../../rol/application/use-cases/by-names-rol.usecase';
import { CreateFarmUseCase } from '../../../farm/application/use-cases/create-farm.usecase';

@injectable()
export class CreateUserProviderUseCase {
  constructor(
    @inject('UserRepository')
    private readonly userRepo: UserRepository,

    @inject('ByNamesRolUseCase')
    private readonly byNamesRolUseCase: ByNamesRolUseCase,

    @inject('CreateFarmUseCase')
    private readonly createFarmUseCase: CreateFarmUseCase,
  ) {}

  async execute(dto: { email: string; provider: string; name: string }) {
    const user = await this.userRepo.getByEmail(dto.email);
    if (user) throw Application.unauthorized('Usuario no disponible.');

    const roles = await this.byNamesRolUseCase.execute([{ name: 'OWNER' }]);
    if (roles.length === 0) {
      throw Application.internal('Rol de usuario no disponible.');
    }
    const newUser = User.create({
      email: dto.email,
      name: dto.name,
      provider: dto.provider,
      roles: roles,
    });

    await this.userRepo.save(newUser);
    await this.createFarmUseCase.execute({
      name: dto.email,
      ownerId: newUser.id,
    });

    return newUser;
  }
}
