import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '@/services/api';
import type { GlobalSettings } from '@/types';

interface SettingsContextType {
  settings: GlobalSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const defaultSettings: GlobalSettings = {
  subscriptionMode: 'free',
  maintenanceMode: false,
  maintenanceMessage: { en: '', si: '' },
  freeUserRestrictions: {
    hideContactNumber: false,
    dailyProfileViews: 0,
    canSeeCompatibility: true,
  },
  defaultLanguage: 'en',
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      setSettings((response as Record<string, unknown>).data as GlobalSettings || defaultSettings);
    } catch {
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
