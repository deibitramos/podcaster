import { QueryClient } from '@tanstack/react-query';

export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
    import('@tanstack/query-core').QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = qc;
