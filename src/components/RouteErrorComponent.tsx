import { useNavigate } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/ui/error';

type Props = { title?: string; error?: Error };
export function RouteErrorComponent({ title, error }: Props) {
  const navigate = useNavigate();

  const handleHome = () => {
    void navigate({ to: '/' });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <ErrorComponent title={title} error={error} onHome={handleHome} onRetry={handleRetry} />
  );
}
