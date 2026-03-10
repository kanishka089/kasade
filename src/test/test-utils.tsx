import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-test';

interface WrapperProps {
  children: ReactNode;
  route?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
function TestProviders({ children, route = '/' }: WrapperProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </I18nextProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { route?: string },
) {
  const { route, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => <TestProviders route={route}>{children}</TestProviders>,
    ...renderOptions,
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { customRender as render };
