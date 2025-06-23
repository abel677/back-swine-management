import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { errorHandler } from './shared/error.middleware';
import { envConfig } from './config/envConfig';

import { apiRateLimiter, authLimiter } from './config/rate-limit';
import userRoutes from './context/user/presentation/routes';
import rolRoutes from './context/rol/presentation/routes';
import authRouts from './context/auth/presentation/routes';
import welcomeRouts from './welcome.routes';
import farmRoutes from './context/farm/presentation/routes';
import bredRoutes from './context/breed/presentation/routes';
import pigRoutes from './context/pig/presentation/routes';
import categoryRoutes from './context/category/presentation/routes';
import productRoutes from './context/product/presentation/routes';
import corralRoutes from './context/corral/presentation/routes';
import deviceRoutes from './context/device/presentation/routes';
import notificationRoutes from './context/notifications/presentation/routes';

const app = express();
app.set('trust proxy', envConfig.NODE_ENV === 'production' ? true : false);

// Seguridad primero
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(apiRateLimiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Logs
app.use(morgan('dev'));

// Rutas
const prefix = '/api/v1';
app.use(`${prefix}/notifications`, notificationRoutes);
app.use(`${prefix}/devices`, deviceRoutes);
app.use(`${prefix}/corrals`, corralRoutes);
app.use(`${prefix}/products`, productRoutes);
app.use(`${prefix}/categories`, categoryRoutes);
app.use(`${prefix}/pigs`, pigRoutes);
app.use(`${prefix}/breeds`, bredRoutes);
app.use(`${prefix}/farms`, farmRoutes);
app.use(`${prefix}/auth`, authLimiter, authRouts);
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/roles`, rolRoutes);
app.use('/', welcomeRouts);

// Manejador de errores
app.use(errorHandler);

// Puerto
app.set('port', envConfig.PORT);

export default app;
