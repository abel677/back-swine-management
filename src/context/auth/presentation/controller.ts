import { Request, Response } from 'express';
import { SignInDto } from '../application/dtos/sign-in.dto';
import { Application } from '../../../utils/http-error';
import { container } from 'tsyringe';
import { SignInUseCase } from '../application/use-cases/sign-in.usecase';
import { TokenService } from '../domain/ports/token.service';
import { VerifyUseCase } from '../application/use-cases/verify.usecase';
import { UserMapper } from '../../user/infrastructure/mappers/user.mapper';
import { SignUpDto } from '../application/dtos/sign-up.dto';
import { SignUpUseCase } from '../application/use-cases/sign-up.usecase';

export const verify = async (req: Request, res: Response) => {
  const verificationToken = req.params.verificationToken;
  const useCase = container.resolve(VerifyUseCase);
  await useCase.execute(verificationToken);
  res.json({
    message: 'Cuenta verificada, ya puedes iniciar sesión.',
  });
};

export const logout = (req: Request, res: Response) => {
  res.json({ message: 'Sesión cerrada' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.body?.refreshToken;
  if (!refreshToken) throw Application.unauthorized('No hay token');
  const tokenSvc = container.resolve<TokenService>('TokenService');
  const payload = await tokenSvc.verifyRefreshToken(refreshToken);
  const newTokens = await tokenSvc.generateTokens(payload);
  res.json({ accessToken: newTokens.accessToken });
};

export const signIn = async (req: Request, res: Response) => {
  const [error, dto] = SignInDto.create(req.body);
  if (error) throw Application.badRequest(error);
  const useCase = container.resolve(SignInUseCase);
  const { accessToken, refreshToken, user } = await useCase.execute(dto!);

  res.json({
    message: 'Inicio de sesión exitoso.',
    user: UserMapper.toHttpResponse(user),
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

export const signUp = async (req: Request, res: Response) => {
  const [error, dto] = SignUpDto.create(req.body);
  if (error) throw Application.badRequest(error);

  const useCase = container.resolve(SignUpUseCase);
  const { accessToken, refreshToken, user } = await useCase.execute(dto!);

  res.json({
    message: 'Inicio de sesión exitoso.',
    user: UserMapper.toHttpResponse(user),
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};
