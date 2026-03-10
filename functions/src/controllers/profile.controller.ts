import { Response } from 'express';
import * as admin from 'firebase-admin';
import { AuthRequest } from '../middleware/auth';
import { profileUpdateSchema } from '../utils/validators';
import { success, error } from '../utils/response';
import { getDoc, setDoc, collections } from '../services/firestore.service';
import { UserProfile } from '../types/user';
import { canViewContactNumber } from '../services/subscription.service';

export async function getMyProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.user!.uid;
    const profile = await getDoc<UserProfile>(collections.users, uid);

    if (!profile) {
      res.status(404).json(error('Profile not found'));
      return;
    }

    res.json(success(profile));
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function updateMyProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(error(parsed.error.issues.map((e: any) => e.message).join(', ')));
      return;
    }

    const uid = req.user!.uid;
    const existing = await getDoc<UserProfile>(collections.users, uid);
    if (!existing) {
      res.status(404).json(error('Profile not found'));
      return;
    }

    const updateData = {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(collections.users, uid, updateData);

    const updated = await getDoc<UserProfile>(collections.users, uid);
    res.json(success(updated, 'Profile updated successfully'));
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function getUserProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.params.uid as string;
    const profile = await getDoc<UserProfile>(collections.users, uid);

    if (!profile || !profile.isActive || profile.isSuspended) {
      res.status(404).json(error('Profile not found'));
      return;
    }

    const viewerUid = req.user!.uid;
    const viewer = await getDoc<UserProfile>(collections.users, viewerUid);

    const profileData = { ...profile };

    // Hide contact number based on subscription
    if (viewer && !(await canViewContactNumber(viewer))) {
      profileData.contactNumber = '***hidden***';
    }

    res.json(success(profileData));
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}

export async function uploadPhoto(req: AuthRequest, res: Response): Promise<void> {
  try {
    const uid = req.user!.uid;

    if (!req.body || !req.body.photo) {
      res.status(400).json(error('No photo data provided. Send base64 encoded image as "photo" field.'));
      return;
    }

    const { photo, isProfilePhoto } = req.body;
    const base64Match = photo.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!base64Match) {
      res.status(400).json(error('Invalid image format. Expected base64 data URI.'));
      return;
    }

    const mimeType = base64Match[1];
    const base64Data = base64Match[2];
    const extension = mimeType.split('/')[1] || 'jpg';
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json(error('Image too large. Maximum 5MB.'));
      return;
    }

    const fileName = `photos/${uid}/${Date.now()}.${extension}`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: mimeType },
      public: true,
    });

    const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
    const publicUrl = emulatorHost
      ? `http://${emulatorHost}/${bucket.name}/${fileName}`
      : `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const profile = await getDoc<UserProfile>(collections.users, uid);
    if (profile) {
      const photos = profile.photos || [];
      if (photos.length >= 6) {
        res.status(400).json(error('Maximum 6 photos allowed'));
        return;
      }
      photos.push(publicUrl);
      const update: any = { photos, updatedAt: new Date().toISOString() };
      if (isProfilePhoto || !profile.profilePhoto) {
        update.profilePhoto = publicUrl;
      }
      await setDoc(collections.users, uid, update);
    }

    res.json(success({ url: publicUrl, fileName }, 'Photo uploaded successfully'));
  } catch (err) {
    console.error('Upload photo error:', err);
    res.status(500).json(error('Internal server error', 500));
  }
}
