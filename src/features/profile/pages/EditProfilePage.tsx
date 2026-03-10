import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, Card, Spinner } from '@/components/ui';
import { SRI_LANKAN_DISTRICTS, EDUCATION_LEVELS } from '@/utils/locations';
import api from '@/services/api';

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get('/profile/me').then((res) => {
      reset((res as Record<string, unknown>).data as Record<string, unknown>);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      setSaving(true);
      await api.put('/profile/me', values);
      navigate('/profile');
    } catch { /* ignored */
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('profile.editProfile')}</h1>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label={t('register.name')} {...register('displayName')} />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('register.education')}
              options={EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))}
              {...register('education')}
            />
            <Input label={t('register.occupation')} {...register('occupation')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('register.location')}
              options={SRI_LANKAN_DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
              {...register('location.district')}
            />
            <Input label={t('register.height')} type="number" {...register('heightCm')} />
          </div>
          <Input label={t('register.contactNumber')} {...register('contactNumber')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.aboutMe')}</label>
            <textarea {...register('aboutMe')} rows={4} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('register.fatherOccupation')} {...register('family.fatherOccupation')} />
            <Input label={t('register.motherOccupation')} {...register('family.motherOccupation')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/profile')} className="flex-1">{t('common.cancel')}</Button>
            <Button type="submit" loading={saving} className="flex-1">{t('common.save')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
