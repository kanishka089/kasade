import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button, Badge, Spinner, Card } from '@/components/ui';
import api from '@/services/api';

interface Report {
  id: string;
  reporterUid: string;
  reportedUid: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res: any = await api.get('/admin/reports');
      setReports(res.data?.reports || res.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/admin/reports/${id}`, { status });
    fetchReports();
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const statusVariant = (s: string) => s === 'pending' ? 'warning' : s === 'resolved' ? 'success' : s === 'dismissed' ? 'default' : 'info';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.reports')}</h1>

      {reports.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No reports</p></Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-medium">{r.reason}</p>
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Reported: {r.reportedUid} | By: {r.reporterUid}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => window.open(`/profile/${r.reportedUid}`, '_blank')}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, 'resolved')}>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, 'dismissed')}>
                    <XCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
