import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Spinner } from '@/components/ui';
import { useSettings } from '@/contexts/SettingsContext';
import api from '@/services/api';

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const save = async () => {
    try {
      setSaving(true);
      await api.put('/admin/settings', form);
      await refresh();
    } catch { /* ignored */ } finally { setSaving(false); }
  };

  if (!form) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.systemSettings')}</h1>

      <div className="space-y-6 max-w-xl">
        <Card header={<span className="font-semibold">{t('admin.subscriptionMode')}</span>}>
          <div className="flex gap-3">
            <button
              onClick={() => setForm({ ...form!, subscriptionMode: 'free' })}
              className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                form.subscriptionMode === 'free' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <p className="font-semibold">{t('admin.freeMode')}</p>
              <p className="text-xs text-gray-500 mt-1">All features unlocked for everyone</p>
            </button>
            <button
              onClick={() => setForm({ ...form!, subscriptionMode: 'paid' })}
              className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                form.subscriptionMode === 'paid' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <p className="font-semibold">{t('admin.paidMode')}</p>
              <p className="text-xs text-gray-500 mt-1">Features gated by subscription</p>
            </button>
          </div>
        </Card>

        <Card header={<span className="font-semibold">Maintenance Mode</span>}>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form!, maintenanceMode: e.target.checked })}
              className="rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm">Enable maintenance mode</span>
          </label>
        </Card>

        {form.subscriptionMode === 'paid' && (
          <Card header={<span className="font-semibold">Free User Restrictions</span>}>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.freeUserRestrictions.hideContactNumber}
                  onChange={(e) => setForm({ ...form!, freeUserRestrictions: { ...form!.freeUserRestrictions, hideContactNumber: e.target.checked } })}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm">Hide contact numbers from free users</span>
              </label>
              <Input
                label="Daily profile view limit (0 = unlimited)"
                type="number"
                value={form.freeUserRestrictions.dailyProfileViews}
                onChange={(e) => setForm({ ...form!, freeUserRestrictions: { ...form!.freeUserRestrictions, dailyProfileViews: Number(e.target.value) } })}
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.freeUserRestrictions.canSeeCompatibility}
                  onChange={(e) => setForm({ ...form!, freeUserRestrictions: { ...form!.freeUserRestrictions, canSeeCompatibility: e.target.checked } })}
                  className="rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm">Free users can see compatibility scores</span>
              </label>
            </div>
          </Card>
        )}

        <Button onClick={save} loading={saving}>{t('common.save')}</Button>
      </div>
    </div>
  );
}
