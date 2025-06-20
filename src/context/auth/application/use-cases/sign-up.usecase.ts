import { inject, injectable } from 'tsyringe';
import { SignUpDto } from '../dtos/sign-up.dto';
import { CreateUserUseCase } from '../../../user/application/use-cases/create-user.usecase';
import { Application } from '../../../../utils/http-error';
import { TokenService } from '../../domain/ports/token.service';
import { ByNamesRolUseCase } from '../../../rol/application/use-cases/by-names-rol.usecase';
import { CreateFarmUseCase } from '../../../farm/application/use-cases/create-farm.usecase';
import { GetUserByEmailUseCase } from '../../../user/application/use-cases/get-user-by-email.usecase';

@injectable()
export class SignUpUseCase {
  constructor(
    @inject('GetUserByEmailUseCase')
    private readonly getUseByEmailUseCase: GetUserByEmailUseCase,
    @inject('ByNamesRolUseCase')
    private readonly byNamesRolUseCase: ByNamesRolUseCase,
    @inject('CreateUserUseCase')
    private readonly createUserUseCase: CreateUserUseCase,
    @inject('CreateFarmUseCase')
    private readonly createFarmUseCase: CreateFarmUseCase,
    @inject('TokenService')
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: SignUpDto) {
    let user = await this.getUseByEmailUseCase.execute(dto.email);
    if (user) throw Application.badRequest('Usuario no disponible.');

    const roles = await this.byNamesRolUseCase.execute([{ name: 'OWNER' }]);
    if (roles.length === 0) {
      throw Application.internal('Rol de usuario no disponible.');
    }

    user = await this.createUserUseCase.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      roles: roles,
    });
    await this.createFarmUseCase.execute({
      name: dto.email,
      ownerId: user.id,
    });

    const payload = { userId: user.id };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);
    return { accessToken, refreshToken, user };
  }
}
