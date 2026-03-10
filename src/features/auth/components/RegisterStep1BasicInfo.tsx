import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@/components/ui';
import { RELIGIONS } from '@/utils/locations';
import type { RegistrationData } from '../pages/RegisterPage';

interface Props {
  data: Partial<RegistrationData>;
  updateData: (d: Partial<RegistrationData>) => void;
  onNext: () => void;
}

export function RegisterStep1BasicInfo({ data, updateData, onNext }: Props) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: data.email || '',
      password: data.password || '',
      displayName: data.displayName || '',
      gender: data.gender || '',
      dateOfBirth: data.dateOfBirth || '',
      religion: data.religion || '',
    },
  });

  const onSubmit = (values: any) => {
    updateData(values);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label={t('register.name')} {...register('displayName', { required: 'Name is required' })} error={errors.displayName?.message as string} />
      <Input label={t('auth.email')} type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message as string} />
      <Input label={t('auth.password')} type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message as string} />
      <Select
        label={t('register.gender')}
        options={[{ value: 'male', label: t('register.male') }, { value: 'female', label: t('register.female') }]}
        placeholder={`-- ${t('register.gender')} --`}
        {...register('gender', { required: 'Gender is required' })}
        error={errors.gender?.message as string}
      />
      <Input label={t('register.dateOfBirth')} type="date" {...register('dateOfBirth', { required: 'Date of birth is required' })} error={errors.dateOfBirth?.message as string} />
      <Select
        label={t('register.religion')}
        options={RELIGIONS.map((r) => ({ value: r, label: r }))}
        placeholder={`-- ${t('register.religion')} --`}
        {...register('religion', { required: 'Religion is required' })}
        error={errors.religion?.message as string}
      />
      <Button type="submit" className="w-full">{t('register.next')}</Button>
    </form>
  );
}
