import 'dotenv/config';

export const envConfig = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '3600', // default 1 hora
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '604800', // default 7 días
  JWT_REFRESH_COOKIE_MAX_AGE: process.env.JWT_REFRESH_COOKIE_MAX_AGE || '7', // default 7 minutos

  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_HOST: process.env.MAIL_HOST,
  GOOGLE_SERVICE_ACCOUNT: process.env.GOOGLE_SERVICE_ACCOUNT,
};
