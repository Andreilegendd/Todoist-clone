'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { AuthInitializer } from '@/components';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  );
}