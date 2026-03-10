import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { register, completeProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/register', authMiddleware, register);
router.post('/complete-profile', authMiddleware, completeProfile);

export default router;
