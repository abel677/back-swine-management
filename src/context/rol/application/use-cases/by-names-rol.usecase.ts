import { inject, injectable } from 'tsyringe';
import { RolRepository } from '../../domain/ports/rol.repository';
import { Application } from '../../../../utils/http-error';

@injectable()
export class ByNamesRolUseCase {
  constructor(
    @inject('RolRepository') private readonly rolRepo: RolRepository,
  ) {}

  async execute(names: { name: string }[]) {
    for (const [index, rol] of names.entries()) {
      if (!rol) {
        throw Application.badRequest(`rol[${index}]: Name rol faltante.`);
      }
    }
    const roles = await this.rolRepo.getByNames(names);
    return roles;
  }
}
