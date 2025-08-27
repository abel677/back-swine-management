import { Router } from 'express';
import { authMiddleware } from '../../../shared/auth.middleware';
import {
  all,
  allReproductiveState,
  allPhases,
  allSettings,
  updateSettings,
} from './controller';

const router = Router();

router.get('/phases', authMiddleware, allPhases);
router.get('/reproductive-stage', authMiddleware, allReproductiveState);
router.get('/settings', authMiddleware, allSettings);
router.put('/settings', authMiddleware, updateSettings);
router.get('/', authMiddleware, all);

export default router;
