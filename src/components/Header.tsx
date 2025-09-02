import { cn } from '@/lib/cn';
import { Link } from '@tanstack/react-router';
import { Headphones } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={cn('flex items-center space-x-3 group transition-all',
              'duration-200 hover:scale-105')}
          >
            <div className="relative">
              <div className={cn('absolute inset-0 rounded-xl blur-lg transition-all duration-300',
                'bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:blur-xl')}
              />
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
                <Headphones className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className={cn('text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 ',
                  'to-blue-400 bg-clip-text text-transparent')}
              >
                Podcaster
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
