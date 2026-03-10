import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { success, error } from '../utils/response';
import { getDoc, queryDocs, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';
import { SubscriptionPlan } from '../types/settings';

export async function getPlans(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const { docs } = await queryDocs<SubscriptionPlan>(collections.subscriptionPlans, [
      { field: 'isActive', op: '==', value: true },
    ]);

    res.json(success(docs));
  } catch (err) {
    console.error('Get plans error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function getSubscriptionStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.user!.uid;
    const user = await getDoc<UserProfile>(collections.users, uid);

    if (!user) {
      res.status(404).json(error('User not found'));
      return;
    }

    const isActive = user.subscription.status === 'active' &&
      user.subscription.endDate !== null &&
      new Date(user.subscription.endDate) > new Date();

    res.json(success({
      subscription: user.subscription,
      isActive,
    }));
  } catch (err) {
    console.error('Get subscription status error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
