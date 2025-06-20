import { inject, injectable } from 'tsyringe';
import { Application } from '../../../../utils/http-error';
import { HashService } from '../../../common/domain/ports/hash-service.port';
import { TokenService } from '../../domain/ports/token.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { CreateUserProviderUseCase } from '../../../user/application/use-cases/create-user-provider.usecase';
import { GetUserByEmailUseCase } from '../../../user/application/use-cases/get-user-by-email.usecase';

@injectable()
export class SignInUseCase {
  constructor(
    @inject('GetUserByEmailUseCase')
    private readonly getUseByEmailUseCase: GetUserByEmailUseCase,
    @inject('CreateUserProviderUseCase')
    private readonly createUserProviderUseCase: CreateUserProviderUseCase,
    @inject('HashService')
    private readonly hashService: HashService,
    @inject('TokenService')
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: SignInDto) {
    let user = await this.getUseByEmailUseCase.execute(dto.email);

    // si se inicia con algún provider diferente de local => Google, Facebook
    if (dto.provider && dto.provider !== 'local') {
      // si no existe se crea el usuario
      if (!user) {
        user = await this.createUserProviderUseCase.execute({
          email: dto.email,
          name: dto.name || dto.email,
          provider: dto.provider,
        });
      }
      // si ya existe generar un token de acceso
      const payload = { userId: user.id };
      const { accessToken, refreshToken } =
        await this.tokenService.generateTokens(payload);
      return { accessToken, refreshToken, user };
    }

    // si no hay un proveedor o es = local
    if (!user) throw Application.badRequest('Credenciales inválidas.');
    if (!dto.password) throw Application.badRequest('Credenciales inválidas');

    const matchPassword = await this.hashService.compare(
      dto.password,
      user.password || '',
    );
    if (!matchPassword) {
      throw Application.badRequest('Credenciales inválidas');
    }
    if (!user.active) throw Application.badRequest();

    const payload = { userId: user.id };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);
    return { accessToken, refreshToken, user };
  }
}
