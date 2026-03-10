import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { searchProfiles } from '../controllers/search.controller';

const router = Router();

router.post('/', authMiddleware, searchProfiles);

export default router;
