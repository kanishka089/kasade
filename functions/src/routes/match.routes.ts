import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getMatchWithUser, customMatch } from '../controllers/match.controller';

const router = Router();

router.get('/:uid', authMiddleware, getMatchWithUser);
router.post('/custom', customMatch); // Public - standalone matching tool

export default router;
