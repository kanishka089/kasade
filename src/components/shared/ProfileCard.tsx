import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, GraduationCap, User } from 'lucide-react';
import { CompatibilityMeter } from './CompatibilityMeter';
import type { UserProfile } from '@/types';

interface ProfileCardProps {
  profile: UserProfile & { compatibilityScore?: number };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      onClick={() => navigate(`/profile/${profile.uid}`)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 relative">
        {profile.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-16 w-16 text-gray-300" />
          </div>
        )}
        {profile.compatibilityScore !== undefined && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
            <CompatibilityMeter percentage={profile.compatibilityScore} size="sm" showLabel={false} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{profile.displayName}</h3>
        <p className="text-sm text-gray-500">
          {profile.age} {t('common.years')}
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{profile.location?.district}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <GraduationCap className="h-3 w-3" />
            <span className="truncate">{profile.education}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
