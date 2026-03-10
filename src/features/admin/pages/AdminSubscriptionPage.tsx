import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit } from 'lucide-react';
import { Button, Card, Input, Modal, Spinner } from '@/components/ui';
import api from '@/services/api';
import type { SubscriptionPlan } from '@/types';

const emptyPlan: Partial<SubscriptionPlan> = {
  name: { en: '', si: '' },
  description: { en: '', si: '' },
  durationDays: 30,
  price: 0,
  currency: 'LKR',
  features: [],
  isActive: true,
};

export default function AdminSubscriptionPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SubscriptionPlan> | null>(null);
  const [saving, setSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState('');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscription/plans') as Record<string, unknown>;
      setPlans(res.data as SubscriptionPlan[] || []);
    } catch { /* ignored */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openEdit = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditing(plan);
      setFeaturesText(plan.features.join('\n'));
    } else {
      setEditing({ ...emptyPlan });
      setFeaturesText('');
    }
  };

  const savePlan = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      const payload = { ...editing, features: featuresText.split('\n').filter(Boolean) };
      await api.post('/admin/subscription-plans', payload);
      setEditing(null);
      fetchPlans();
    } catch { /* ignored */ } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('admin.subscriptionSettings')}</h1>
        <Button onClick={() => openEdit()}><Plus className="h-4 w-4 mr-1" />Add Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{plan.name.en}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(plan)} className="p-1 hover:bg-gray-100 rounded"><Edit className="h-4 w-4 text-gray-500" /></button>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary-600">Rs. {plan.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{plan.durationDays} days</p>
            <ul className="mt-3 text-sm space-y-1">
              {plan.features.map((f, i) => <li key={i} className="text-gray-600">- {f}</li>)}
            </ul>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Plan' : 'New Plan'} size="lg">
        {editing && (
          <div className="space-y-4">
            <Input label="Name (English)" value={editing.name?.en || ''} onChange={(e) => setEditing({ ...editing, name: { ...editing.name!, en: e.target.value } })} />
            <Input label="Name (Sinhala)" value={editing.name?.si || ''} onChange={(e) => setEditing({ ...editing, name: { ...editing.name!, si: e.target.value } })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (LKR)" type="number" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              <Input label="Duration (days)" type="number" value={editing.durationDays || 30} onChange={(e) => setEditing({ ...editing, durationDays: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
              <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <Button onClick={savePlan} loading={saving} className="w-full">{t('common.save')}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
