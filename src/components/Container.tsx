// components/container.tsx
import * as React from 'react';
import { cn } from '@/lib/cn';

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'my-4 mx-auto w-full px-4 sm:px-6 lg:px-8',
        'max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',
        className,
      )}
      {...props}
    />
  );
}
