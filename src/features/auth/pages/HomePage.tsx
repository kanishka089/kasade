import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Shield, Users } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import type { UserProfile } from '@/types';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<(UserProfile & { compatibilityScore?: number })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await api.post('/search', {
          ageRange: { min: 18, max: 80 },
          page: 1,
          limit: 20,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resData = res as any;
        const profilesData = (resData.data as Record<string, unknown>)?.profiles as Record<string, unknown>[] || [];
        const list = profilesData.map((p) => ({
          ...p,
          compatibilityScore: (p.compatibility as Record<string, unknown>)?.percentage as number | undefined,
        })) as (UserProfile & { compatibilityScore?: number })[];
        list.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
        setProfiles(list);
      } catch { /* ignored */
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-banner.png"
          alt="Sri Lankan Wedding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('app.name')}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('app.tagline')}
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Button size="lg" onClick={() => navigate('/search')}>
                {t('nav.search')}
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Top Matches for logged-in users */}
      {user && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('home.topMatches')}</h2>
              <Button variant="outline" onClick={() => navigate('/search')}>
                {t('home.viewAll')}
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : profiles.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t('home.noMatches')}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {profiles.map((p) => <ProfileCard key={p.uid} profile={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 mb-4">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature1Title')}</h3>
              <p className="text-gray-600 text-sm">{t('home.feature1Desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gold-100 text-gold-600 mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature2Title')}</h3>
              <p className="text-gray-600 text-sm">{t('home.feature2Desc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-100 text-green-600 mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature3Title')}</h3>
              <p className="text-gray-600 text-sm">{t('home.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
