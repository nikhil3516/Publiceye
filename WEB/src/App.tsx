import React, { useState } from 'react';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SplashScreen } from '@/components/SplashScreen';
import { initTheme } from '@/store/useThemeStore';

// Initialize dark mode from persisted state before render
initTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <>
            <RouterProvider router={router} />
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: { borderRadius: '1rem', fontWeight: 600 },
              }}
            />
          </>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
