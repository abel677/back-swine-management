import { Router } from 'express';
import { authMiddleware } from '../../../shared/auth.middleware';
import {
  all,
  allReproductiveState,
  allPhases,
  allSettings,
} from './controller';

const router = Router();

router.get('/phases', authMiddleware, allPhases);
router.get('/reproductive-stage', authMiddleware, allReproductiveState);
router.get('/settings', authMiddleware, allSettings);
router.get('/', authMiddleware, all);

export default router;
