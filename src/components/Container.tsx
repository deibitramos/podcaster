// components/container.tsx
import * as React from 'react';
import { cn } from '@/lib/cn';

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative py-4 mx-auto w-full px-4 sm:px-6 lg:px-8',
        'sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl',
        className,
      )}
      {...props}
    />
  );
}
