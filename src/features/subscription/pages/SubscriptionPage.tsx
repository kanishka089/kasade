import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Check } from 'lucide-react';
import { Card, Badge, Spinner } from '@/components/ui';
import api from '@/services/api';
import type { SubscriptionPlan } from '@/types';

export default function SubscriptionPage() {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lang = i18n.language as 'en' | 'si';

  useEffect(() => {
    Promise.all([
      api.get('/subscription/plans').then((r: any) => setPlans(r.data || [])).catch(() => {}),
      api.get('/subscription/status').then((r: any) => setStatus(r.data?.subscription ?? r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <CreditCard className="h-10 w-10 text-gold-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">{t('subscription.choosePlan')}</h1>
      </div>

      {status && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('subscription.currentPlan')}</p>
              <p className="text-lg font-semibold capitalize">{status.status}</p>
            </div>
            <Badge variant={status.status === 'active' ? 'success' : status.status === 'expired' ? 'danger' : 'default'}>
              {t(`subscription.${status.status}`)}
            </Badge>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="text-center">
            <h3 className="text-lg font-semibold">{plan.name[lang] || plan.name.en}</h3>
            <p className="text-3xl font-bold text-primary-600 my-3">
              Rs. {plan.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">{plan.durationDays} days</p>
            <ul className="text-sm text-left space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400">{t('subscription.contactAdmin')}</p>
          </Card>
        ))}
        {plans.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No subscription plans available. The platform is currently free.
          </div>
        )}
      </div>
    </div>
  );
}
