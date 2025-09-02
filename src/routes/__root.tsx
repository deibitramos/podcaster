import { Container } from '@/components/Container';
import Player from '@/components/player/Player';
import { RouteErrorComponent } from '@/components/RouteErrorComponent';
import { ToastProvider } from '@/components/ui/toast';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

type RouteContext = { qc: QueryClient };

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <RootLayout />
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: ({ error }) => <RouteErrorComponent title="Application Error" error={error} />,
});

function RootLayout() {
  return (
    <>
      <div id="backstyle" />
      <Container>
        <Outlet />
      </Container>
      <Player />
      <ToastProvider />
    </>
  );
}
