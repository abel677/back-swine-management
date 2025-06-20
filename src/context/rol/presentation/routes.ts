import { Router } from 'express';
import { all } from './controller';

const router = Router();

router.get('/', all);

export default router;
