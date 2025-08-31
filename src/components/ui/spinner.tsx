import { cn } from '@/lib/cn';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'primary';
  className?: string;
  strokeWidth?: number;
}

const sizeMap = { sm: 16, md: 24, lg: 32, xl: 48 };
const strokeWidthMap = { sm: 2, md: 2.5, lg: 3, xl: 4 };

function Spinner(props: Props) {
  const { size = 'md', variant = 'default', className, strokeWidth: strokeWidthParam } = props;
  const dimension = sizeMap[size];
  const strokeWidth = strokeWidthParam ?? strokeWidthMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const variantClasses = {
    default: 'text-primary',
    muted: 'text-muted-foreground',
    primary: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={dimension}
        height={dimension}
        className={cn('animate-spin', variantClasses[variant])}
        viewBox={`0 0 ${dimension} ${dimension}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-25"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
          className="opacity-75"
          style={{
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { Spinner };
