import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { SRI_LANKAN_DISTRICTS, RELIGIONS } from '@/utils/locations';
import type { RegistrationData } from '../pages/RegisterPage';
import type { ReactNode } from 'react';

interface Props {
  data: Partial<RegistrationData>;
  updateData: (d: Partial<RegistrationData>) => void;
  onPrev: () => void;
  children?: ReactNode;
}

export function RegisterStep5Preferences({ data, updateData, onPrev, children }: Props) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      ageMin: data.preferences?.ageRange?.min || 18,
      ageMax: data.preferences?.ageRange?.max || 40,
      heightMin: data.preferences?.heightRange?.minCm || 140,
      heightMax: data.preferences?.heightRange?.maxCm || 200,
    },
  });

  const onSubmit = (values: Record<string, unknown>) => {
    updateData({
      preferences: {
        ageRange: { min: Number(values.ageMin), max: Number(values.ageMax) },
        heightRange: { minCm: Number(values.heightMin), maxCm: Number(values.heightMax) },
        education: [],
        location: [],
        religion: [],
        caste: [],
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-medium text-gray-800">{t('register.ageRange')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min" type="number" min={18} max={80} {...register('ageMin')} />
        <Input label="Max" type="number" min={18} max={80} {...register('ageMax')} />
      </div>

      <h3 className="font-medium text-gray-800">{t('register.heightRange')} (cm)</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min" type="number" min={100} max={220} {...register('heightMin')} />
        <Input label="Max" type="number" min={100} max={220} {...register('heightMax')} />
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Preferred Locations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
          {SRI_LANKAN_DISTRICTS.map((d) => (
            <label key={d.name} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" value={d.name} className="rounded border-gray-300 text-primary-600" />
              {d.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Preferred Religion</h3>
        <div className="flex flex-wrap gap-3">
          {RELIGIONS.map((r) => (
            <label key={r} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" value={r} className="rounded border-gray-300 text-primary-600" />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1">{t('register.previous')}</Button>
        <div className="flex-1">{children}</div>
      </div>
    </form>
  );
}
