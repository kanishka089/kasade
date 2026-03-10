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
