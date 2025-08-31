import * as React from 'react';

import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary',
        'selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full',
        'min-w-0 rounded-md border bg-transparent px-2 py-2 text-base shadow-xs',
        'transition-[color,box-shadow] outline-none file:inline-flex file:h-7',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

type IconInputProps = React.ComponentProps<'input'> & {
  icon: LucideIcon;
  parentClassName?: string;
};
function IconInput({ icon: Icon, parentClassName, className, ...props }: IconInputProps) {
  return (
    <div className={cn('relative', parentClassName)}>
      <span className="absolute top-2.5 left-2 cursor-pointer select-none">
        <Icon className="size-5" />
      </span>
      <Input {...props} className={cn('pl-8', className)} />
    </div>
  );
}

export { Input, IconInput };
