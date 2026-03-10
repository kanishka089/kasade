import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, User, Settings, Search, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Button } from '@/components/ui';

export function Header() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="kasade.lk" className="h-20" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/search" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <Search className="h-4 w-4" />{t('nav.search')}
                </Link>
                <Link to="/match-tool" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <Sparkles className="h-4 w-4" />{t('nav.matchTool')}
                </Link>
                <Link to="/profile" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="h-4 w-4" />{t('nav.myProfile')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                    <Settings className="h-4 w-4" />{t('nav.admin')}
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>{t('nav.login')}</Button>
                <Button onClick={() => navigate('/register')}>{t('nav.register')}</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <Link to="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.search')}</Link>
                <Link to="/match-tool" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.matchTool')}</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.myProfile')}</Link>
                <Link to="/subscription" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.subscription')}</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.admin')}</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50">{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{t('nav.login')}</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-primary-600 font-medium hover:bg-primary-50">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
