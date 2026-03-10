import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Sparkles, User } from 'lucide-react';
import { Button, Input, Select, Card } from '@/components/ui';
import { CompatibilityMeter } from '@/components/shared/CompatibilityMeter';
import { SRI_LANKAN_DISTRICTS } from '@/utils/locations';
import { RASHIS, NAKSHATRAS } from '@/components/shared/horoscopeData';
import api from '@/services/api';
import type { MatchResult } from '@/types';

export default function MatchToolPage() {
  const { t } = useTranslation();
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'birth' | 'manual'>('birth');

  const formA = useForm({ defaultValues: { date: '', time: '', district: '', rashi: '', nakshatra: '' } });
  const formB = useForm({ defaultValues: { date: '', time: '', district: '', rashi: '', nakshatra: '' } });

  const handleCalculate = async () => {
    const a = formA.getValues();
    const b = formB.getValues();
    try {
      setLoading(true);
      const distA = SRI_LANKAN_DISTRICTS.find((d) => d.name === a.district);
      const distB = SRI_LANKAN_DISTRICTS.find((d) => d.name === b.district);

      const payload: Record<string, unknown> = {};
      if (inputMode === 'birth') {
        payload.person1 = { birthDate: a.date, birthTime: a.time, birthPlace: { name: a.district, latitude: distA?.latitude || 7, longitude: distA?.longitude || 80, timezone: 'Asia/Colombo' } };
        payload.person2 = { birthDate: b.date, birthTime: b.time, birthPlace: { name: b.district, latitude: distB?.latitude || 7, longitude: distB?.longitude || 80, timezone: 'Asia/Colombo' } };
      } else {
        payload.person1 = { rashi: Number(a.rashi), nakshatra: Number(a.nakshatra) };
        payload.person2 = { rashi: Number(b.rashi), nakshatra: Number(b.nakshatra) };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await api.post('/match/custom', payload) as any;
      const resData = res.data as Record<string, unknown> | undefined;
      setResult((resData?.compatibility ?? res.compatibility ?? resData) as MatchResult);
    } catch { /* ignored */
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadMyHoroscope = async (form: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await api.get('/profile/me') as any;
      const resData = res.data as Record<string, unknown> | undefined;
      const horoscope = resData?.horoscope as Record<string, unknown> | undefined;
      if (horoscope) {
        form.setValue('rashi', String(horoscope.rashi));
        form.setValue('nakshatra', String(horoscope.nakshatra));
        setInputMode('manual');
      }
    } catch { /* ignored */ }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PersonForm = ({ form, label }: { form: any; label: string }) => (
    <Card header={<div className="flex items-center gap-2"><User className="h-4 w-4" /><span className="font-semibold">{label}</span></div>}>
      {inputMode === 'birth' ? (
        <div className="space-y-3">
          <Input label={t('register.dateOfBirth')} type="date" {...form.register('date')} />
          <Input label={t('register.birthTime')} type="time" {...form.register('time')} />
          <Select
            label={t('register.birthPlace')}
            options={SRI_LANKAN_DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
            placeholder="--"
            {...form.register('district')}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <Select label={t('register.rashi')} options={RASHIS.map((r, i) => ({ value: i.toString(), label: r }))} placeholder="--" {...form.register('rashi')} />
          <Select label={t('register.nakshatra')} options={NAKSHATRAS.map((n, i) => ({ value: i.toString(), label: n }))} placeholder="--" {...form.register('nakshatra')} />
        </div>
      )}
      <Button variant="ghost" size="sm" className="mt-2" onClick={() => loadMyHoroscope(form)}>
        {t('matchTool.useMyHoroscope')}
      </Button>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Sparkles className="h-10 w-10 text-gold-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">{t('matchTool.title')}</h1>
        <p className="text-gray-500 mt-1">{t('matchTool.description')}</p>
      </div>

      {/* Input mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <Button variant={inputMode === 'birth' ? 'primary' : 'outline'} size="sm" onClick={() => setInputMode('birth')}>
          By Birth Details
        </Button>
        <Button variant={inputMode === 'manual' ? 'primary' : 'outline'} size="sm" onClick={() => setInputMode('manual')}>
          By Rashi/Nakshatra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PersonForm form={formA} label={t('matchTool.personA')} />
        <PersonForm form={formB} label={t('matchTool.personB')} />
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleCalculate} loading={loading}>
          <Sparkles className="h-5 w-5 mr-2" />{t('matchTool.calculate')}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className="mt-8" header={<span className="font-semibold">{t('matchTool.result')}</span>}>
          <div className="flex flex-col items-center mb-6">
            <CompatibilityMeter percentage={result.percentage} size="lg" />
            <p className="mt-2 text-lg font-semibold">{result.totalScore} / {result.maxScore}</p>
            <p className="text-gray-500">{t(`matchTool.${result.recommendation?.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())}`)}</p>
          </div>
          <div className="space-y-3">
            {result.breakdown.map((k) => (
              <div key={k.name} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-600">{k.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-primary-500 h-3 rounded-full transition-all"
                    style={{ width: `${(k.score / k.maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{k.score}/{k.maxScore}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
