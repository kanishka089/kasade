import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, GraduationCap, Briefcase, Users, Lock } from 'lucide-react';
import { Card, Spinner, Badge } from '@/components/ui';
import { CompatibilityMeter } from '@/components/shared/CompatibilityMeter';
import { HoroscopeChart } from '@/components/shared/HoroscopeChart';
import { RASHIS, NAKSHATRAS } from '@/components/shared/horoscopeData';
import api from '@/services/api';
import type { UserProfile, MatchResult } from '@/types';

const RASHIS_SI = ['මේෂ', 'වෘෂභ', 'මිථුන', 'කටක', 'සිංහ', 'කන්‍යා', 'තුලා', 'වෘශ්චික', 'ධනු', 'මකර', 'කුම්භ', 'මීන'];
const NAKSHATRAS_SI = [
  'අශ්විනි', 'භරණි', 'කෘත්තිකා', 'රෝහිණි', 'මෘගශිර්ෂා', 'ආර්ද්‍රා',
  'පුනර්වසු', 'පුෂ්‍ය', 'ආශ්ලේෂා', 'මඝා', 'පූර්ව ඵල්ගුනි', 'උත්තර ඵල්ගුනි',
  'හස්ත', 'චිත්‍රා', 'ස්වාති', 'විශාඛා', 'අනුරාධා', 'ජ්‍යේෂ්ඨා',
  'මූල', 'පූර්වාෂාඪා', 'උත්තරාෂාඪා', 'ශ්‍රවණ', 'ධනිෂ්ඨා', 'ශතභිෂා',
  'පූර්ව භාද්‍රපද', 'උත්තර භාද්‍රපද', 'රේවතී',
];

function normalizeRashi(s: string): string {
  return s.toLowerCase().replace(/h/g, '').replace(/s/g, '').replace(/u$/, '');
}

function resolveRashi(val: string | number, isSi: boolean): string {
  if (typeof val === 'number') return isSi ? RASHIS_SI[val] : RASHIS[val];
  // Try exact match first, then fuzzy
  let idx = RASHIS.findIndex((r) => r.toLowerCase() === val.toLowerCase());
  if (idx < 0) idx = RASHIS.findIndex((r) => normalizeRashi(r) === normalizeRashi(val));
  if (idx >= 0) return isSi ? RASHIS_SI[idx] : RASHIS[idx];
  return val;
}

function resolveNakshatra(val: string | number, isSi: boolean): string {
  if (typeof val === 'number') return isSi ? NAKSHATRAS_SI[val] : NAKSHATRAS[val];
  const norm = (s: string) => s.toLowerCase().replace(/\s/g, '').replace(/h/g, '');
  let idx = NAKSHATRAS.findIndex((n) => n.toLowerCase().replace(/\s/g, '') === val.toString().toLowerCase().replace(/\s/g, ''));
  if (idx < 0) idx = NAKSHATRAS.findIndex((n) => norm(n) === norm(val.toString()));
  if (idx >= 0) return isSi ? NAKSHATRAS_SI[idx] : NAKSHATRAS[idx];
  return val;
}

export default function ViewProfilePage() {
  const { uid } = useParams<{ uid: string }>();
  const { t, i18n } = useTranslation();
  const isSi = i18n.language === 'si';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api.get(`/profile/${uid}`).then((r: any) => { setProfile((r.data ?? r) as UserProfile); }).catch(() => {}),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api.get(`/match/${uid}`).then((r: any) => { const dd = r.data as Record<string, unknown> | undefined; setMatch((dd?.compatibility ?? r.compatibility ?? dd) as MatchResult); }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [uid]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-500">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Photo & Compatibility */}
        <div className="space-y-4">
          <Card>
            <div className="text-center">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="" className="w-32 h-32 rounded-full mx-auto object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-100 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <h2 className="mt-3 text-xl font-semibold">{profile.displayName}</h2>
              <p className="text-gray-500">{profile.age} {t('common.years')}</p>
            </div>
          </Card>

          {match && (
            <Card header={<span className="font-semibold">{t('profile.compatibility')}</span>}>
              <div className="flex justify-center mb-4">
                <CompatibilityMeter percentage={match.percentage} size="lg" />
              </div>
              <Badge variant={match.recommendation === 'excellent' ? 'success' : match.recommendation === 'good' ? 'info' : 'warning'}>
                {t(`matchTool.${match.recommendation?.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())}`) || match.recommendation}
              </Badge>
              <div className="mt-4 space-y-2">
                {match.breakdown.map((k) => (
                  <div key={k.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{t(`horoscope.${k.name.replace(/\s+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^./, (c: string) => c.toLowerCase())}`, k.name)}</span>
                    <span className="font-medium">{k.score}/{k.maxScore}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Details */}
        <Card className="md:col-span-2">
          <div className="space-y-2 text-sm mb-6">
            {profile.contactNumber ? (
              <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" />{profile.contactNumber}</div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400"><Lock className="h-4 w-4" />{t('profile.subscribeTo')}</div>
            )}
            <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4" />{profile.location?.district}</div>
            <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="h-4 w-4" />{profile.education}</div>
            <div className="flex items-center gap-2 text-gray-600"><Briefcase className="h-4 w-4" />{profile.occupation}</div>
          </div>

          <h3 className="font-semibold mb-2">{t('register.aboutMe')}</h3>
          <p className="text-gray-600 text-sm mb-6">{profile.aboutMe}</p>

          <h3 className="font-semibold mb-2">{t('profile.familyInfo')}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            <div><span className="text-gray-500">{t('register.fatherOccupation')}:</span> {profile.family?.fatherOccupation}</div>
            <div><span className="text-gray-500">{t('register.motherOccupation')}:</span> {profile.family?.motherOccupation}</div>
            <div><span className="text-gray-500">{t('register.siblings')}:</span> {profile.family?.siblings}</div>
            <div><span className="text-gray-500">{t('register.familyType')}:</span> {profile.family?.familyType}</div>
          </div>

          {profile.horoscope && (
            <>
              <h3 className="font-semibold mb-2">{t('profile.horoscope')}</h3>
              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div>{t('horoscope.rashi')}: {resolveRashi(profile.horoscope.rashi, isSi)}</div>
                <div>{t('horoscope.nakshatra')}: {resolveNakshatra(profile.horoscope.nakshatra, isSi)}</div>
                <div>{t('horoscope.lagna')}: {resolveRashi(profile.horoscope.lagna, isSi)}</div>
              </div>
              {profile.horoscope.planetPositions && (
                <HoroscopeChart lagna={profile.horoscope.lagna} planetPositions={profile.horoscope.planetPositions} />
              )}
            </>
          )}

        </Card>
      </div>
    </div>
  );
}
