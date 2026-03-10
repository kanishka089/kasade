import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';
import { Button, Input, Badge, Spinner, Modal } from '@/components/ui';
import api from '@/services/api';
import type { UserProfile } from '@/types';

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?page=${p}&search=${search}`) as Record<string, unknown>;
      setUsers((res.data as Record<string, unknown>)?.users as UserProfile[] || []);
      setPage(p);
    } catch { /* ignored */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleSuspend = async (uid: string, suspend: boolean) => {
    await api.put(`/admin/users/${uid}`, { isSuspended: suspend });
    fetchUsers(page);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.userManagement')}</h1>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => fetchUsers(1)}><Search className="h-4 w-4" /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Gender</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{u.displayName}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.gender}</td>
                  <td className="px-4 py-3">
                    {u.isSuspended ? <Badge variant="danger">Suspended</Badge> : <Badge variant="success">Active</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {u.isSuspended ? (
                        <Button variant="ghost" size="sm" onClick={() => toggleSuspend(u.uid, false)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => toggleSuspend(u.uid, true)}>
                          <Ban className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center py-8 text-gray-500">No users found</p>}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchUsers(page - 1)}>Prev</Button>
        <span className="px-3 py-1.5 text-sm">Page {page}</span>
        <Button variant="outline" size="sm" onClick={() => fetchUsers(page + 1)}>Next</Button>
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details" size="lg">
        {selectedUser && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><strong>Name:</strong> {selectedUser.displayName}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Gender:</strong> {selectedUser.gender}</div>
              <div><strong>Age:</strong> {selectedUser.age}</div>
              <div><strong>District:</strong> {selectedUser.location?.district}</div>
              <div><strong>Education:</strong> {selectedUser.education}</div>
              <div><strong>Occupation:</strong> {selectedUser.occupation}</div>
              <div><strong>Contact:</strong> {selectedUser.contactNumber}</div>
              <div><strong>Subscription:</strong> {selectedUser.subscription?.status}</div>
              <div><strong>Profile Complete:</strong> {selectedUser.profileComplete ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
