import { Router } from 'express';
import { all, deleteMany, deleteOne, profile } from './controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.get('/', all);
router.delete('/:id', deleteOne);
router.post('/delete-many', deleteMany);
router.get('/profile', authMiddleware, profile);

export default router;
