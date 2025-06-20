import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../../user/domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';
import { TokenService } from '../../domain/ports/token.service';

@injectable()
export class VerifyUseCase {
  constructor(
    @inject('UserRepository') private readonly userRepo: UserRepository,
    @inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  async execute(verificationToken: string) {
    const user = await this.userRepo.getByVerificationToken(verificationToken);
    if (!user) throw Application.unauthorized('Sesión expirada.');

    user.markAsVerified();
    await this.userRepo.save(user);

    const payload = { userId: user.id };
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(payload);

    return { accessToken, refreshToken };
  }
}
