import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generateHoroscope, validateHoroscope, confirmHoroscope } from '../controllers/horoscope.controller';

const router = Router();

router.post('/generate', generateHoroscope); // Public - no user data needed, just calculates
router.post('/validate', authMiddleware, validateHoroscope);
router.post('/confirm', authMiddleware, confirmHoroscope);

export default router;
