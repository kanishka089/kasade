import { HoroscopeData } from './horoscope';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  age: number;
  religion: string;
  caste: string;
  education: string;
  occupation: string;
  location: { district: string; city: string; province: string };
  heightCm: number;
  aboutMe: string;
  contactNumber: string;
  photos: string[];
  profilePhoto: string;
  family: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: number;
    familyValues: string;
    familyType: 'nuclear' | 'joint' | 'extended';
  };
  preferences: {
    ageRange: { min: number; max: number };
    heightRange: { minCm: number; maxCm: number };
    education: string[];
    occupation: string[];
    location: string[];
    caste: string[];
    religion: string[];
  };
  horoscope: HoroscopeData | null;
  subscription: {
    status: 'free' | 'active' | 'expired';
    planId: string | null;
    startDate: string | null;
    endDate: string | null;
  };
  isAdmin: boolean;
  isActive: boolean;
  isSuspended: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}
