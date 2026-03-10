import { UserProfile } from '../types/user';
import { GlobalSettings } from '../types/settings';
import { getDoc, collections } from './firestore.service';

export async function hasActiveSubscription(user: UserProfile): Promise<boolean> {
  if (user.subscription.status === 'active' && user.subscription.endDate) {
    return new Date(user.subscription.endDate) > new Date();
  }
  return false;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const settings = await getDoc<GlobalSettings>(collections.settings, 'global');
  if (!settings) {
    return {
      subscriptionMode: 'free',
      maintenanceMode: false,
      maintenanceMessage: { en: '', si: '' },
      freeUserRestrictions: {
        hideContactNumber: true,
        dailyProfileViews: 10,
        canSeeCompatibility: false,
      },
      defaultLanguage: 'en',
    };
  }
  return settings;
}

export async function canViewContactNumber(viewer: UserProfile): Promise<boolean> {
  const settings = await getGlobalSettings();
  if (settings.subscriptionMode === 'free') return true;
  if (await hasActiveSubscription(viewer)) return true;
  return !settings.freeUserRestrictions.hideContactNumber;
}

export async function canSeeCompatibility(viewer: UserProfile): Promise<boolean> {
  const settings = await getGlobalSettings();
  if (settings.subscriptionMode === 'free') return true;
  if (await hasActiveSubscription(viewer)) return true;
  return settings.freeUserRestrictions.canSeeCompatibility;
}
