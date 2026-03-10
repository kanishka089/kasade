import { z } from 'zod';

export const registerSchema = z.object({
  displayName: z.string().min(2).max(100),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  religion: z.string().min(1).max(50),
  contactNumber: z.string().min(9).max(15),
});

export const completeProfileSchema = z.object({
  caste: z.string().max(100).optional(),
  education: z.string().min(1).max(200),
  occupation: z.string().min(1).max(200),
  location: z.object({
    district: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
  }),
  heightCm: z.number().min(100).max(250),
  aboutMe: z.string().min(10).max(2000),
  family: z.object({
    fatherOccupation: z.string().max(200),
    motherOccupation: z.string().max(200),
    siblings: z.number().int().min(0).max(20),
    familyValues: z.string().max(500),
    familyType: z.enum(['nuclear', 'joint', 'extended']),
  }),
  preferences: z.object({
    ageRange: z.object({ min: z.number().min(18).max(80), max: z.number().min(18).max(80) }),
    heightRange: z.object({ minCm: z.number().min(100).max(250), maxCm: z.number().min(100).max(250) }),
    education: z.array(z.string()).optional(),
    occupation: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    caste: z.array(z.string()).optional(),
    religion: z.array(z.string()).optional(),
  }),
});

export const profileUpdateSchema = completeProfileSchema.partial().extend({
  displayName: z.string().min(2).max(100).optional(),
  contactNumber: z.string().min(9).max(15).optional(),
  photos: z.array(z.string().url()).max(6).optional(),
  profilePhoto: z.string().url().optional(),
});

export const searchFiltersSchema = z.object({
  gender: z.enum(['male', 'female']).optional(),
  ageRange: z.object({ min: z.number().min(18), max: z.number().max(80) }).optional(),
  location: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  religion: z.array(z.string()).optional(),
  caste: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export const horoscopeInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/),
  birthPlace: z.object({
    name: z.string().min(1),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    timezone: z.string().min(1),
  }),
});

export const userProvidedHoroscopeSchema = horoscopeInputSchema.extend({
  rashi: z.number().int().min(0).max(11),
  nakshatra: z.number().int().min(0).max(26),
  nakshatraPada: z.number().int().min(1).max(4),
  lagna: z.number().int().min(0).max(11),
  planetPositions: z.record(z.string(), z.object({
    rashi: z.number().int().min(0).max(11),
    degree: z.number().min(0).max(360),
    nakshatra: z.number().int().min(0).max(26),
  })),
});

export const adminSettingsSchema = z.object({
  subscriptionMode: z.enum(['free', 'paid']).optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.object({ en: z.string(), si: z.string() }).optional(),
  freeUserRestrictions: z.object({
    hideContactNumber: z.boolean(),
    dailyProfileViews: z.number().int().min(0),
    canSeeCompatibility: z.boolean(),
  }).optional(),
  defaultLanguage: z.enum(['en', 'si']).optional(),
});

export const subscriptionPlanSchema = z.object({
  id: z.string().optional(),
  name: z.object({ en: z.string(), si: z.string() }),
  description: z.object({ en: z.string(), si: z.string() }),
  durationDays: z.number().int().min(1),
  price: z.number().min(0),
  currency: z.literal('LKR'),
  features: z.array(z.string()),
  isActive: z.boolean(),
});
