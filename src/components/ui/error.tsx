import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/cn';
import { DEV } from '@/lib/constants';

type Props = {
  title?: string;
  error?: Error;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'inline';
};

export function ErrorComponent(props: Props) {
  const {
    title = 'Something went wrong', error, onRetry, onHome, className, variant = 'default',
  } = props;
  const errorMessage = error?.message ?? 'An unexpected error occurred';

  if (variant === 'minimal') {
    return (
      <div className={cn('text-red-400 text-sm p-2', className)}>
        {`${title}. ${errorMessage}`}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border',
        'border-red-500/20 text-red-400', className)}
      >
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm font-bold">{title}</span>
          <span className="text-sm">{errorMessage}</span>
        </div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[200px]',
      'p-8 text-center', className)}
    >
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md">{errorMessage}</p>

      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
        {onHome && (
          <Button onClick={onHome} className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        )}
      </div>

      {DEV && error?.stack && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-400">
            Error Details (dev only)
          </summary>
          <pre className={cn('mt-2 text-xs text-gray-500 bg-gray-800 p-2 rounded',
            'overflow-auto max-w-md')}
          >
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
