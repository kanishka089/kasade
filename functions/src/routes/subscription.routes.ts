import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPlans, getSubscriptionStatus } from '../controllers/subscription.controller';

const router = Router();

router.get('/plans', authMiddleware, getPlans);
router.get('/status', authMiddleware, getSubscriptionStatus);

export default router;
