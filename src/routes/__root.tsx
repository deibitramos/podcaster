import Player from '@/components/Player';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <RootLayout />
      <TanStackRouterDevtools />
    </>
  ),
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Player />
    </div>
  );
}
