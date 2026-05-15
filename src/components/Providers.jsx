'use client';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/reactQuery';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { useAnalytics } from '../hooks/useAnalytics';

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <React.Suspense fallback={null}>
            <AnalyticsTracker />
          </React.Suspense>
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
