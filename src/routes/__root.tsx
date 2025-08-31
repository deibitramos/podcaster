import { Container } from '@/components/Container';
import Player from '@/components/player/Player';
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
  errorComponent: () => <div>Error loading route</div>,
});

function RootLayout() {
  return (
    <>
      <div id="backstyle" />
      <Container>
        <Outlet />
      </Container>
      <Player />
    </>
  );
}
