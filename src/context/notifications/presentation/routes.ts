import { Router } from 'express';
import { authMiddleware } from '../../../shared/auth.middleware';
import { all, create, markRead } from './controller';

const router = Router();

router.put('/:id', authMiddleware, markRead);
router.post('/', authMiddleware, create);
router.get('/', authMiddleware, all);

export default router;
