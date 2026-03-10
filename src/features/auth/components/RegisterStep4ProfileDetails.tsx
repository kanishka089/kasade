import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@/components/ui';
import { SRI_LANKAN_DISTRICTS, EDUCATION_LEVELS } from '@/utils/locations';
import type { RegistrationData } from '../pages/RegisterPage';

interface Props {
  data: Partial<RegistrationData>;
  updateData: (d: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function RegisterStep4ProfileDetails({ data, updateData, onNext, onPrev }: Props) {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      education: data.education || '',
      occupation: data.occupation || '',
      district: data.district || '',
      city: data.city || '',
      heightCm: data.heightCm || 165,
      aboutMe: data.aboutMe || '',
      contactNumber: data.contactNumber || '',
      caste: '',
      fatherOccupation: data.family?.fatherOccupation || '',
      motherOccupation: data.family?.motherOccupation || '',
      siblings: data.family?.siblings || 0,
      familyValues: data.family?.familyValues || '',
      familyType: data.family?.familyType || 'nuclear',
    },
  });

  const selectedDistrict = watch('district');
  const districtData = SRI_LANKAN_DISTRICTS.find((d) => d.name === selectedDistrict);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: Record<string, any>) => {
    updateData({
      education: values.education,
      occupation: values.occupation,
      district: values.district,
      city: values.city,
      heightCm: Number(values.heightCm),
      aboutMe: values.aboutMe,
      contactNumber: values.contactNumber,
      family: {
        fatherOccupation: values.fatherOccupation,
        motherOccupation: values.motherOccupation,
        siblings: Number(values.siblings),
        familyValues: values.familyValues,
        familyType: values.familyType,
      },
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={t('register.education')}
          options={EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))}
          placeholder="--"
          {...register('education', { required: 'Required' })}
          error={errors.education?.message as string}
        />
        <Input label={t('register.occupation')} {...register('occupation', { required: 'Required' })} error={errors.occupation?.message as string} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={t('register.location')}
          options={SRI_LANKAN_DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
          placeholder={t('register.selectDistrict')}
          {...register('district', { required: 'Required' })}
          error={errors.district?.message as string}
        />
        {districtData && (
          <Select
            label={t('register.selectCity')}
            options={districtData.cities.map((c) => ({ value: c.name, label: c.name }))}
            placeholder="--"
            {...register('city')}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('register.height')} type="number" min={100} max={220} {...register('heightCm', { required: 'Required' })} error={errors.heightCm?.message as string} />
        <Input label={t('register.contactNumber')} type="tel" placeholder="+94 7X XXX XXXX" {...register('contactNumber', { required: 'Required' })} error={errors.contactNumber?.message as string} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.aboutMe')}</label>
        <textarea
          {...register('aboutMe')}
          rows={3}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <hr className="my-4" />
      <h3 className="font-semibold text-gray-800">{t('register.familyDetails')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('register.fatherOccupation')} {...register('fatherOccupation')} />
        <Input label={t('register.motherOccupation')} {...register('motherOccupation')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('register.siblings')} type="number" min={0} max={20} {...register('siblings')} />
        <Select
          label={t('register.familyType')}
          options={[
            { value: 'nuclear', label: 'Nuclear' },
            { value: 'joint', label: 'Joint' },
            { value: 'extended', label: 'Extended' },
          ]}
          {...register('familyType')}
        />
      </div>
      <Input label={t('register.familyValues')} placeholder="Traditional, Modern, etc." {...register('familyValues')} />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1">{t('register.previous')}</Button>
        <Button type="submit" className="flex-1">{t('register.next')}</Button>
      </div>
    </form>
  );
}
