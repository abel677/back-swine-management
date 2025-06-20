import { Router } from 'express';
import { create } from './controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.post('/', authMiddleware, create);

export default router;
