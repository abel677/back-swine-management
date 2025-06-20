import { Router } from 'express';
import { authMiddleware } from '../../../shared/auth.middleware';
import { all } from './controller';

const router = Router();

router.get('/', authMiddleware, all);

export default router;
