import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserPlus, Flag } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import api from '@/services/api';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats((r as Record<string, unknown>).data as Record<string, unknown>)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const cards = [
    { label: t('admin.totalUsers'), value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: t('admin.activeUsers'), value: stats?.activeUsers || 0, icon: UserCheck, color: 'bg-green-100 text-green-600' },
    { label: t('admin.newThisMonth'), value: stats?.newThisMonth || 0, icon: UserPlus, color: 'bg-purple-100 text-purple-600' },
    { label: t('admin.pendingReports'), value: stats?.pendingReports || 0, icon: Flag, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
