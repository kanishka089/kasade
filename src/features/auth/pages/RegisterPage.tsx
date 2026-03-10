import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import api from '@/services/api';
import { RegisterStep1BasicInfo } from '../components/RegisterStep1BasicInfo';
import { RegisterStep2BirthDetails } from '../components/RegisterStep2BirthDetails';
import { RegisterStep3HoroscopeReview } from '../components/RegisterStep3HoroscopeReview';
import { RegisterStep4ProfileDetails } from '../components/RegisterStep4ProfileDetails';
import { RegisterStep5Preferences } from '../components/RegisterStep5Preferences';

const STEPS = ['register.step1Title', 'register.step2Title', 'register.step3Title', 'register.step4Title', 'register.step5Title'];

export interface RegistrationData {
  // Step 1
  email: string;
  password: string;
  displayName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  religion: string;
  // Step 2
  birthTime: string;
  birthPlace: { name: string; district: string; latitude: number; longitude: number };
  provideHoroscope: boolean;
  userRashi?: number;
  userNakshatra?: number;
  userLagna?: number;
  // Step 3
  calculatedHoroscope?: Record<string, unknown>;
  chosenHoroscope?: Record<string, unknown>;
  // Step 4
  education: string;
  occupation: string;
  district: string;
  city: string;
  heightCm: number;
  aboutMe: string;
  contactNumber: string;
  family: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: number;
    familyValues: string;
    familyType: 'nuclear' | 'joint' | 'extended';
  };
  photos: string[];
  // Step 5
  preferences: {
    ageRange: { min: number; max: number };
    heightRange: { minCm: number; maxCm: number };
    education: string[];
    location: string[];
    religion: string[];
    caste: string[];
  };
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<RegistrationData>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateData = (partial: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      // Create Firebase auth account
      await authRegister(data.email!, data.password!);

      // Register basic info
      await api.post('/auth/register', {
        displayName: data.displayName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        religion: data.religion,
        contactNumber: data.contactNumber || '+94000000000',
      });

      // Complete profile with structured data
      const districtData = data.district ? { district: data.district, city: data.city || data.district, province: data.district } : { district: '', city: '', province: '' };
      await api.post('/auth/complete-profile', {
        education: data.education || '',
        occupation: data.occupation || '',
        location: districtData,
        heightCm: Number(data.heightCm) || 165,
        aboutMe: data.aboutMe || '',
        family: data.family || {
          fatherOccupation: '',
          motherOccupation: '',
          siblings: 0,
          familyValues: '',
          familyType: 'nuclear',
        },
        preferences: data.preferences || {
          ageRange: { min: 18, max: 45 },
          heightRange: { minCm: 140, maxCm: 200 },
        },
      });

      // Save horoscope if calculated
      if (data.chosenHoroscope || data.calculatedHoroscope) {
        try {
          await api.post('/horoscope/confirm', {
            horoscope: data.chosenHoroscope || data.calculatedHoroscope,
            useUserProvided: false,
          });
        } catch { /* horoscope save is optional */ }
      }

      navigate('/search');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="h-10 w-10 text-primary-600 mx-auto mb-2" fill="currentColor" />
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">{t(STEPS[step])}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 0 && <RegisterStep1BasicInfo data={data} updateData={updateData} onNext={nextStep} />}
          {step === 1 && <RegisterStep2BirthDetails data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {step === 2 && <RegisterStep3HoroscopeReview data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {step === 3 && <RegisterStep4ProfileDetails data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
          {step === 4 && (
            <RegisterStep5Preferences data={data} updateData={updateData} onPrev={prevStep}>
              <Button onClick={handleSubmit} loading={submitting} className="w-full">
                {t('register.submit')}
              </Button>
            </RegisterStep5Preferences>
          )}
        </div>
      </div>
    </div>
  );
}
