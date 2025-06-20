export interface TokenPayload {
  userId: string;
  //email: string;
}
export interface DecodedTokenPayload extends TokenPayload {
  iat?: number;
  exp?: number;
}
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenService {
  generateTokens(payload: TokenPayload): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
}
