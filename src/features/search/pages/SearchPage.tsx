import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button, Select, Input, Spinner } from '@/components/ui';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { SRI_LANKAN_DISTRICTS, RELIGIONS, EDUCATION_LEVELS } from '@/utils/locations';
import api from '@/services/api';
import type { UserProfile } from '@/types';

export default function SearchPage() {
  const { t } = useTranslation();
  const [results, setResults] = useState<(UserProfile & { compatibilityScore?: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '' as string,
    ageMin: '18',
    ageMax: '50',
    district: '',
    education: '',
    religion: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const search = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.post('/search', {
        gender: filters.gender || undefined,
        ageRange: { min: Number(filters.ageMin), max: Number(filters.ageMax) },
        district: filters.district || undefined,
        education: filters.education || undefined,
        religion: filters.religion || undefined,
        page: p,
        limit: 20,
      });
      const resData = (res as Record<string, unknown>).data as Record<string, unknown> | undefined;
      const profilesList = (resData?.profiles as Record<string, unknown>[] || []).map((p) => ({
        ...p,
        compatibilityScore: (p.compatibility as Record<string, unknown>)?.percentage as number | undefined,
      })) as (UserProfile & { compatibilityScore?: number })[];
      profilesList.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
      setResults(profilesList);
      setTotal((resData?.pagination as Record<string, unknown>)?.total as number || profilesList.length);
      setPage(p);
    } catch { /* ignored */
    } finally {
      setLoading(false);
    }
  };

  // Auto-search on mount
  useEffect(() => { search(1); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('search.title')}</h1>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />{t('search.filters')}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Select
              label={t('register.gender')}
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
              placeholder="Any"
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            />
            <Input label="Age Min" type="number" value={filters.ageMin} onChange={(e) => setFilters({ ...filters, ageMin: e.target.value })} />
            <Input label="Age Max" type="number" value={filters.ageMax} onChange={(e) => setFilters({ ...filters, ageMax: e.target.value })} />
            <Select
              label={t('register.location')}
              options={SRI_LANKAN_DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
              placeholder="Any"
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            />
            <Select
              label={t('register.education')}
              options={EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))}
              placeholder="Any"
              value={filters.education}
              onChange={(e) => setFilters({ ...filters, education: e.target.value })}
            />
            <Select
              label={t('register.religion')}
              options={RELIGIONS.map((r) => ({ value: r, label: r }))}
              placeholder="Any"
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => search(1)}><Search className="h-4 w-4 mr-1" />{t('search.apply')}</Button>
            <Button variant="ghost" onClick={() => setFilters({ gender: '', ageMin: '18', ageMax: '50', district: '', education: '', religion: '' })}>
              <X className="h-4 w-4 mr-1" />{t('search.clearFilters')}
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('search.noResults')}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{total} profiles found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((p) => <ProfileCard key={p.uid} profile={p} />)}
          </div>
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page <= 1} onClick={() => search(page - 1)}>Previous</Button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
              <Button variant="outline" onClick={() => search(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
