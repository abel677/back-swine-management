import { Router } from 'express';
import { logout, refreshToken, signIn, signUp, verify } from './controller';

const router = Router();

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/verify/:verificationToken', verify);

export default router;
