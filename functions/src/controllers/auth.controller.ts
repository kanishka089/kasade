import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { registerSchema, completeProfileSchema } from '../utils/validators';
import { success, error } from '../utils/response';
import { setDoc, getDoc, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';

export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: any) => e.message).join(', ')));
      return;
    }

    const uid = req.user!.uid;
    const email = req.user!.email || '';

    const existing = await getDoc<UserProfile>(collections.users, uid);
    if (existing) {
      res.status(409).json(error('User already registered'));
      return;
    }

    const { displayName, gender, dateOfBirth, religion, contactNumber } = parsed.data;
    const birthDate = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    const now = new Date().toISOString();
    const userDoc: UserProfile = {
      uid,
      email,
      displayName,
      gender,
      dateOfBirth,
      age,
      religion,
      caste: '',
      education: '',
      occupation: '',
      location: { district: '', city: '', province: '' },
      heightCm: 0,
      aboutMe: '',
      contactNumber,
      photos: [],
      profilePhoto: '',
      family: {
        fatherOccupation: '',
        motherOccupation: '',
        siblings: 0,
        familyValues: '',
        familyType: 'nuclear',
      },
      preferences: {
        ageRange: { min: 18, max: 45 },
        heightRange: { minCm: 140, maxCm: 200 },
        education: [],
        occupation: [],
        location: [],
        caste: [],
        religion: [],
      },
      horoscope: null,
      subscription: { status: 'free', planId: null, startDate: null, endDate: null },
      isAdmin: false,
      isActive: true,
      isSuspended: false,
      profileComplete: false,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(collections.users, uid, userDoc as unknown as Record<string, unknown>);

    res.status(201).json(success(userDoc, 'Registration successful'));
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function completeProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = completeProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: any) => e.message).join(', ')));
      return;
    }

    const uid = req.user!.uid;
    const existing = await getDoc<UserProfile>(collections.users, uid);
    if (!existing) {
      res.status(404).json(error('User not found. Please register first.'));
      return;
    }

    const updateData = {
      ...parsed.data,
      profileComplete: true,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(collections.users, uid, updateData);

    const updated = await getDoc<UserProfile>(collections.users, uid);
    res.json(success(updated, 'Profile completed successfully'));
  } catch (err) {
    console.error('Complete profile error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
