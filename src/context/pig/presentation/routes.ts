import { Router } from 'express';
import { all, create, remove, update } from './controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.delete('/:id', authMiddleware, remove);
router.put('/:id', authMiddleware, update);
router.post('/', authMiddleware, create);
router.get('/', authMiddleware, all);

export default router;
