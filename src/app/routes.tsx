import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AdminRoute } from '@/components/shared/AdminRoute';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FullPageSpinner } from '@/components/ui';

const HomePage = lazy(() => import('@/features/auth/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'));
const MatchToolPage = lazy(() => import('@/features/match-tool/pages/MatchToolPage'));
const MyProfilePage = lazy(() => import('@/features/profile/pages/MyProfilePage'));
const EditProfilePage = lazy(() => import('@/features/profile/pages/EditProfilePage'));
const ViewProfilePage = lazy(() => import('@/features/profile/pages/ViewProfilePage'));
const SubscriptionPage = lazy(() => import('@/features/subscription/pages/SubscriptionPage'));
const DashboardPage = lazy(() => import('@/features/admin/pages/DashboardPage'));
const UserManagementPage = lazy(() => import('@/features/admin/pages/UserManagementPage'));
const AdminSettingsPage = lazy(() => import('@/features/admin/pages/AdminSettingsPage'));
const AdminReportsPage = lazy(() => import('@/features/admin/pages/AdminReportsPage'));
const AdminSubscriptionPage = lazy(() => import('@/features/admin/pages/AdminSubscriptionPage'));

export function AppRoutes() {
  return (
    <ErrorBoundary>
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/match-tool" element={<MatchToolPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/:uid" element={<ViewProfilePage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/subscription" element={<AdminSubscriptionPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}
