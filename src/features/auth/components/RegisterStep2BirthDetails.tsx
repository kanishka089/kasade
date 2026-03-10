import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@/components/ui';
import { SRI_LANKAN_DISTRICTS } from '@/utils/locations';
import { RASHIS, NAKSHATRAS } from '@/components/shared/horoscopeData';
import type { RegistrationData } from '../pages/RegisterPage';

interface Props {
  data: Partial<RegistrationData>;
  updateData: (d: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function RegisterStep2BirthDetails({ data, updateData, onNext, onPrev }: Props) {
  const { t } = useTranslation();
  const [provideHoroscope, setProvideHoroscope] = useState(data.provideHoroscope || false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      birthTime: data.birthTime || '',
      birthDistrict: data.birthPlace?.district || '',
      userRashi: data.userRashi?.toString() || '',
      userNakshatra: data.userNakshatra?.toString() || '',
      userLagna: data.userLagna?.toString() || '',
    },
  });

  const selectedDistrict = watch('birthDistrict');
  const district = SRI_LANKAN_DISTRICTS.find((d) => d.name === selectedDistrict);

  const onSubmit = (values: Record<string, string>) => {
    const districtData = SRI_LANKAN_DISTRICTS.find((d) => d.name === values.birthDistrict);
    updateData({
      birthTime: values.birthTime,
      birthPlace: {
        name: values.birthDistrict,
        district: values.birthDistrict,
        latitude: districtData?.latitude || 7.0,
        longitude: districtData?.longitude || 80.0,
      },
      provideHoroscope,
      ...(provideHoroscope ? {
        userRashi: parseInt(values.userRashi),
        userNakshatra: parseInt(values.userNakshatra),
        userLagna: parseInt(values.userLagna),
      } : {}),
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('register.birthTime')}
        type="time"
        {...register('birthTime', { required: 'Birth time is required' })}
        error={errors.birthTime?.message as string}
      />
      <Select
        label={t('register.birthPlace')}
        options={SRI_LANKAN_DISTRICTS.map((d) => ({ value: d.name, label: `${d.name} (${d.province})` }))}
        placeholder={t('register.selectDistrict')}
        {...register('birthDistrict', { required: 'Birth place is required' })}
        error={errors.birthDistrict?.message as string}
      />
      {district && (
        <p className="text-xs text-gray-500">
          Coordinates: {district.latitude.toFixed(4)}, {district.longitude.toFixed(4)}
        </p>
      )}

      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={provideHoroscope}
          onChange={(e) => setProvideHoroscope(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-sm text-gray-700">{t('register.provideHoroscope')}</span>
      </label>

      {provideHoroscope && (
        <div className="space-y-4 p-4 bg-gold-50 rounded-lg border border-gold-200">
          <Select
            label={t('register.rashi')}
            options={RASHIS.map((r, i) => ({ value: i.toString(), label: r }))}
            placeholder={`-- ${t('register.rashi')} --`}
            {...register('userRashi')}
          />
          <Select
            label={t('register.nakshatra')}
            options={NAKSHATRAS.map((n, i) => ({ value: i.toString(), label: n }))}
            placeholder={`-- ${t('register.nakshatra')} --`}
            {...register('userNakshatra')}
          />
          <Select
            label={t('register.lagna')}
            options={RASHIS.map((r, i) => ({ value: i.toString(), label: r }))}
            placeholder={`-- ${t('register.lagna')} --`}
            {...register('userLagna')}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1">{t('register.previous')}</Button>
        <Button type="submit" className="flex-1">{t('register.next')}</Button>
      </div>
    </form>
  );
}
