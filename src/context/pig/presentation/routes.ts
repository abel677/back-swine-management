import { Router } from 'express';
import { all, create, update } from './controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.put('/:id', authMiddleware, update);
router.post('/', authMiddleware, create);
router.get('/', authMiddleware, all);

export default router;
