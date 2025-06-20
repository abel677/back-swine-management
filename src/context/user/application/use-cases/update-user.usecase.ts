import { inject, injectable } from 'tsyringe';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRepository } from '../../domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';
import { ByIdsRolUseCase } from '../../../rol/application/use-cases/by-ids-rol.usecase';

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('UserRepository') private readonly userRepo: UserRepository,
    @inject('ByIdsRolUseCase')
    private readonly ByIdsRolUseCase: ByIdsRolUseCase,
  ) {}

  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.getById(id);
    if (!user) throw Application.badRequest('Usuario no disponible.');

    if (dto.email) user.updateEmail(dto.email);
    if (dto.name) user.updateName(dto.name);

    if (dto.roles && dto.roles.length > 0) {
      const roles = await this.ByIdsRolUseCase.execute(dto.roles);

      const requestedIds = user.roles.map((r) => r.id);
      const foundIds = roles.map((r) => r.id);
      const notFoundIds = requestedIds.filter((id) => !foundIds.includes(id));

      if (notFoundIds.length > 0) {
        throw Application.badRequest(
          `Los siguientes roles no existen: ${notFoundIds.join(', ')}`,
        );
      }
      user.updateRoles(roles);
    }
    await this.userRepo.save(user);
    return user;
  }
}
