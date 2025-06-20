import { inject, injectable } from 'tsyringe';
import { RolRepository } from '../../domain/ports/rol.repository';
import { Regex } from '../../../../utils/regex';
import { Application } from '../../../../utils/http-error';

@injectable()
export class ByIdsRolUseCase {
  constructor(
    @inject('RolRepository') private readonly rolRepo: RolRepository,
  ) {}

  async execute(ids: { id: string }[]) {
    for (const [index, rol] of ids.entries()) {
      if (!Regex.isValidUUID(rol.id)) {
        throw Application.badRequest(`rol[${index}]: ID rol inválido.`);
      }
    }
    const roles = await this.rolRepo.getByIds(ids);
    return roles;
  }
}
