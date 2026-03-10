import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/search');
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/search');
    } catch {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-primary-600 mx-auto mb-3" fill="currentColor" />
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.login')}</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label={t('auth.password')}
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              {t('auth.login')}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">{t('auth.orContinueWith')}</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            {t('auth.loginWithGoogle')}
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
