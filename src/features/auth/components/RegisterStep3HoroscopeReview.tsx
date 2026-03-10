import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Spinner } from '@/components/ui';
import { RASHIS, NAKSHATRAS } from '@/components/shared/horoscopeData';
import { HoroscopeChart } from '@/components/shared/HoroscopeChart';
import api from '@/services/api';
import type { RegistrationData } from '../pages/RegisterPage';

interface Props {
  data: Partial<RegistrationData>;
  updateData: (d: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function RegisterStep3HoroscopeReview({ data, updateData, onNext, onPrev }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [calculated, setCalculated] = useState<any>(null);
  const [error, setError] = useState('');
  const [choice, setChoice] = useState<'calculated' | 'provided'>('calculated');

  useEffect(() => {
    const generate = async () => {
      try {
        setLoading(true);
        const response: any = await api.post('/horoscope/generate', {
          birthDate: data.dateOfBirth,
          birthTime: data.birthTime,
          birthPlace: {
            name: data.birthPlace?.name || data.birthPlace?.district || 'Colombo',
            latitude: data.birthPlace?.latitude || 6.9271,
            longitude: data.birthPlace?.longitude || 79.8612,
            timezone: 'Asia/Colombo',
          },
        });
        setCalculated(response.data);
        updateData({ calculatedHoroscope: response.data });
      } catch {
        setError('Could not generate horoscope. You can continue with your provided data or try again.');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, []);

  const handleNext = () => {
    if (choice === 'calculated' && calculated) {
      updateData({ chosenHoroscope: calculated });
    } else if (data.provideHoroscope) {
      updateData({
        chosenHoroscope: {
          rashi: data.userRashi,
          nakshatra: data.userNakshatra,
          lagna: data.userLagna,
        },
      });
    }
    onNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Calculating your horoscope...</p>
      </div>
    );
  }

  const hasMismatch = data.provideHoroscope && calculated && (
    data.userRashi !== calculated.rashi ||
    data.userNakshatra !== calculated.nakshatra
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">{error}</div>
      )}

      {calculated && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculated */}
          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            choice === 'calculated' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`} onClick={() => setChoice('calculated')}>
            <h3 className="font-semibold mb-3">{t('register.calculatedHoroscope')}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">{t('horoscope.rashi')}:</span> {RASHIS[calculated.rashi]}</p>
              <p><span className="text-gray-500">{t('horoscope.nakshatra')}:</span> {NAKSHATRAS[calculated.nakshatra]}</p>
              <p><span className="text-gray-500">{t('horoscope.lagna')}:</span> {RASHIS[calculated.lagna]}</p>
            </div>
            {calculated.planetPositions && (
              <div className="mt-4">
                <HoroscopeChart lagna={calculated.lagna} planetPositions={calculated.planetPositions} />
              </div>
            )}
          </div>

          {/* User provided */}
          {data.provideHoroscope && (
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              choice === 'provided' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`} onClick={() => setChoice('provided')}>
              <h3 className="font-semibold mb-3">{t('register.providedHoroscope')}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">{t('horoscope.rashi')}:</span> {RASHIS[data.userRashi || 0]}</p>
                <p><span className="text-gray-500">{t('horoscope.nakshatra')}:</span> {NAKSHATRAS[data.userNakshatra || 0]}</p>
                <p><span className="text-gray-500">{t('horoscope.lagna')}:</span> {RASHIS[data.userLagna || 0]}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {hasMismatch && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          {t('register.mismatchWarning')}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onPrev} className="flex-1">{t('register.previous')}</Button>
        <Button onClick={handleNext} className="flex-1">{t('register.next')}</Button>
      </div>
    </div>
  );
}
