import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getMyProfile, updateMyProfile, getUserProfile, uploadPhoto } from '../controllers/profile.controller';

const router = Router();

router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.post('/photo', authMiddleware, uploadPhoto);
router.get('/:uid', authMiddleware, getUserProfile);

export default router;
