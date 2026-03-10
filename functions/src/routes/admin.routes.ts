import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import {
  getDashboard,
  getUsers,
  getUserDetail,
  updateUser,
  deactivateUser,
  getReports,
  updateReport,
  updateSettings,
  manageSubscriptionPlan,
  setUserSubscription,
  setAdmin,
} from '../controllers/admin.controller';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:uid', getUserDetail);
router.put('/users/:uid', updateUser);
router.delete('/users/:uid', deactivateUser);
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);
router.put('/settings', updateSettings);
router.post('/subscription-plans', manageSubscriptionPlan);
router.put('/users/:uid/subscription', setUserSubscription);
router.post('/set-admin', setAdmin);

export default router;
