import rateLimit from 'express-rate-limit';
import { envConfig } from './envConfig';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: envConfig.NODE_ENV === 'production' ? 500 : 100000, // máx 100 solicitudes por IP en ese tiempo
  message:
    'Demasiadas solicitudes desde esta IP. Intenta nuevamente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: envConfig.NODE_ENV === 'production' ? 5 : 100000, // solo 5 intentos de login por IP en 15 minutos
  message: 'Demasiados intentos de autenticación. Intenta más tarde.',
});
