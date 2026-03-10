import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, CreditCard, Flag, Settings } from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard', end: true },
  { to: '/admin/users', icon: Users, labelKey: 'admin.userManagement' },
  { to: '/admin/subscription', icon: CreditCard, labelKey: 'admin.subscriptionSettings' },
  { to: '/admin/reports', icon: Flag, labelKey: 'admin.reports' },
  { to: '/admin/settings', icon: Settings, labelKey: 'admin.systemSettings' },
];

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, labelKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
