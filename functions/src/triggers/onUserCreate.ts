import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
  const db = admin.firestore();
  const now = new Date().toISOString();

  const userDoc = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    gender: '',
    dateOfBirth: '',
    age: 0,
    religion: '',
    caste: '',
    education: '',
    occupation: '',
    location: { district: '', city: '', province: '' },
    heightCm: 0,
    aboutMe: '',
    contactNumber: user.phoneNumber || '',
    photos: [],
    profilePhoto: user.photoURL || '',
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

  await db.collection('users').doc(user.uid).set(userDoc);
  console.log(`Created Firestore doc for new user: ${user.uid}`);
});
