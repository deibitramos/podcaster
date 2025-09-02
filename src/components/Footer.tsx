import { cn } from '@/lib/cn';
import { Heart, Code } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-border/30 backdrop-blur-sm">
      <div className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className={cn('flex flex-col sm:flex-row items-center',
            'gap-2 text-sm text-muted-foreground')}
          >
            <span>
              {'Built with '}
              <Heart className="inline w-4 h-4 text-red-400" />
              {' by '}
              <a
                href="https://www.linkedin.com/in/deibitramos/"
                className="text-purple-400 hover:text-purple-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deibit Ramos
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/deibitramos/podcaster"
              className={cn('flex items-center gap-1 text-sm text-muted-foreground',
                'hover:text-foreground transition-colors')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code className="w-4 h-4" />
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
