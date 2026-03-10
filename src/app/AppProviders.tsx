import { Suspense, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { FullPageSpinner } from '@/components/ui';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageSpinner />}>
        <BrowserRouter>
          <AuthProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}
