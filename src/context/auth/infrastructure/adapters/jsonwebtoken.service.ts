import jwt from 'jsonwebtoken';
import {
  DecodedTokenPayload,
  TokenPair,
  TokenPayload,
  TokenService,
} from '../../domain/ports/token.service';
import { envConfig } from '../../../../config/envConfig';

export class JwtTokenService implements TokenService {
  async generateTokens(payload: TokenPayload): Promise<TokenPair> {
    const { exp, iat, ...cleanPayload } = payload as DecodedTokenPayload;
    const accessToken = jwt.sign(cleanPayload, envConfig.JWT_ACCESS_SECRET, {
      expiresIn: Number(envConfig.JWT_ACCESS_EXPIRES_IN),
    });

    const refreshToken = jwt.sign(cleanPayload, envConfig.JWT_REFRESH_SECRET, {
      expiresIn: Number(envConfig.JWT_REFRESH_EXPIRES_IN)  *24 * 60 * 60,
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as TokenPayload;
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as TokenPayload;
  }
}
