import { Router } from 'express';
import { authMiddleware } from '../../../shared/auth.middleware';
import { all, create, update } from './controller';

const router = Router();

router.get('/', authMiddleware, all);
router.put('/:id', authMiddleware, update);
router.post('/', authMiddleware, create);

export default router;
