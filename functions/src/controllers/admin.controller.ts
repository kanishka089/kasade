import { Response } from 'express';
import * as admin from 'firebase-admin';
import { AuthRequest } from '../middleware/auth';
import { adminSettingsSchema, subscriptionPlanSchema } from '../utils/validators';
import { success, error } from '../utils/response';
import {
  getDoc, setDoc, updateDoc,
  queryDocs, getFirestore, collections,
} from '../services/firestore.service';
import { UserProfile } from '../types/user';

export async function getDashboard(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const db = getFirestore();

    const [totalSnap, activeSnap, suspendedSnap, reportsSnap] = await Promise.all([
      db.collection(collections.users).count().get(),
      db.collection(collections.users).where('isActive', '==', true).count().get(),
      db.collection(collections.users).where('isSuspended', '==', true).count().get(),
      db.collection(collections.reports).where('status', '==', 'pending').count().get(),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const newThisMonthSnap = await db.collection(collections.users)
      .where('createdAt', '>=', startOfMonth)
      .count().get();

    res.json(success({
      totalUsers: totalSnap.data().count,
      activeUsers: activeSnap.data().count,
      suspendedUsers: suspendedSnap.data().count,
      newThisMonth: newThisMonthSnap.data().count,
      pendingReports: reportsSnap.data().count,
    }));
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function getUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];

    if (search) {
      filters.push({ field: 'displayName', op: '>=', value: search });
      filters.push({ field: 'displayName', op: '<=', value: search + '\uf8ff' });
    }

    const offset = (page - 1) * limit;
    const { docs, total } = await queryDocs<UserProfile>(collections.users, filters, {
      orderBy: 'createdAt',
      direction: 'desc',
      limit,
      offset,
    });

    res.json(success({
      users: docs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function getUserDetail(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.params.uid as string;
    const user = await getDoc<UserProfile>(collections.users, uid);

    if (!user) {
      res.status(404).json(error('User not found'));
      return;
    }

    res.json(success(user));
  } catch (err) {
    console.error('Get user detail error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.params.uid as string;
    const { isSuspended, isActive } = req.body;

    const user = await getDoc<UserProfile>(collections.users, uid);
    if (!user) {
      res.status(404).json(error('User not found'));
      return;
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (typeof isSuspended === 'boolean') updateData.isSuspended = isSuspended;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await updateDoc(collections.users, uid, updateData);

    const updated = await getDoc<UserProfile>(collections.users, uid);
    res.json(success(updated, 'User updated successfully'));
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function deactivateUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.params.uid as string;

    const user = await getDoc<UserProfile>(collections.users, uid);
    if (!user) {
      res.status(404).json(error('User not found'));
      return;
    }

    await updateDoc(collections.users, uid, {
      isActive: false,
      updatedAt: new Date().toISOString(),
    });

    res.json(success(null, 'User deactivated successfully'));
  } catch (err) {
    console.error('Deactivate user error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function getReports(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];
    if (status) {
      filters.push({ field: 'status', op: '==', value: status });
    }

    const offset = (page - 1) * limit;
    const { docs, total } = await queryDocs(collections.reports, filters, {
      orderBy: 'createdAt',
      direction: 'desc',
      limit,
      offset,
    });

    res.json(success({
      reports: docs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }));
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function updateReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, resolution } = req.body;

    if (!status) {
      res.status(400).json(error('Status is required'));
      return;
    }

    await updateDoc(collections.reports, id, {
      status,
      resolution: resolution || '',
      resolvedBy: req.user!.uid,
      updatedAt: new Date().toISOString(),
    });

    res.json(success(null, 'Report updated successfully'));
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function updateSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = adminSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: { message: string }) => e.message).join(', ')));
      return;
    }

    await setDoc(collections.settings, 'global', parsed.data as Record<string, unknown>);

    const updated = await getDoc(collections.settings, 'global');
    res.json(success(updated, 'Settings updated successfully'));
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function manageSubscriptionPlan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = subscriptionPlanSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: { message: string }) => e.message).join(', ')));
      return;
    }

    const planData = parsed.data;
    const planId = planData.id || getFirestore().collection(collections.subscriptionPlans).doc().id;

    await setDoc(collections.subscriptionPlans, planId, {
      ...planData,
      id: planId,
      updatedAt: new Date().toISOString(),
    });

    res.json(success({ id: planId, ...planData }, 'Subscription plan saved'));
  } catch (err) {
    console.error('Manage subscription plan error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function setUserSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.params.uid as string;
    const { status, planId, durationDays } = req.body;

    const user = await getDoc<UserProfile>(collections.users, uid);
    if (!user) {
      res.status(404).json(error('User not found'));
      return;
    }

    const now = new Date();
    const endDate = durationDays
      ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await updateDoc(collections.users, uid, {
      subscription: {
        status: status || 'active',
        planId: planId || null,
        startDate: now.toISOString(),
        endDate,
      },
      updatedAt: now.toISOString(),
    });

    res.json(success(null, 'User subscription updated'));
  } catch (err) {
    console.error('Set user subscription error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function setAdmin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { uid, isAdmin } = req.body;

    if (!uid || typeof isAdmin !== 'boolean') {
      res.status(400).json(error('uid and isAdmin (boolean) are required'));
      return;
    }

    await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
    await updateDoc(collections.users, uid, {
      isAdmin,
      updatedAt: new Date().toISOString(),
    });

    res.json(success(null, `Admin claim ${isAdmin ? 'granted' : 'revoked'} for user ${uid}`));
  } catch (err) {
    console.error('Set admin error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
