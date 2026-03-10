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

export interface HoroscopeData {
  birthDate: string;
  birthTime: string;
  birthPlace: { name: string; latitude: number; longitude: number; timezone: string };
  rashi: number;
  nakshatra: number;
  nakshatraPada: number;
  lagna: number;
  planetPositions: Record<string, { rashi: number; degree: number; nakshatra: number }>;
  horoscopeSource: 'calculated' | 'user_provided' | 'user_confirmed_override';
}

export interface KootaResult {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface MatchResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: KootaResult[];
  recommendation: 'excellent' | 'good' | 'average' | 'below_average' | 'not_recommended';
}

export interface GlobalSettings {
  subscriptionMode: 'free' | 'paid';
  maintenanceMode: boolean;
  maintenanceMessage: { en: string; si: string };
  freeUserRestrictions: {
    hideContactNumber: boolean;
    dailyProfileViews: number;
    canSeeCompatibility: boolean;
  };
  defaultLanguage: 'en' | 'si';
}

export interface SubscriptionPlan {
  id: string;
  name: { en: string; si: string };
  description: { en: string; si: string };
  durationDays: number;
  price: number;
  currency: 'LKR';
  features: string[];
  isActive: boolean;
}

export interface SearchFilters {
  gender?: 'male' | 'female';
  ageRange?: { min: number; max: number };
  district?: string;
  education?: string;
  religion?: string;
  caste?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  profiles: (UserProfile & { compatibilityScore?: number })[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
