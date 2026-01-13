import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { QueryClient, useQuery } from '@tanstack/react-query';

// Simple test component that uses TanStack Query
function TestComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: () => {
      return Promise.resolve({ message: 'Hello from test' });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data?.message}</div>;
}

describe('Test Utils', () => {
  it('should render with QueryClient provider', async () => {
    render(<TestComponent />);

    // Component should render loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Then should show the data
    const message = await screen.findByText('Hello from test');
    expect(message).toBeInTheDocument();
  });

  it('should allow custom QueryClient', async () => {
    const customQueryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
      },
    });

    render(<TestComponent />, { queryClient: customQueryClient });

    const message = await screen.findByText('Hello from test');
    expect(message).toBeInTheDocument();
  });
});
