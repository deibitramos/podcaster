import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="py-6 w-full text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h1 className="text-2xl font-bold text-foreground">Discover Amazing Podcasts</h1>
        <Sparkles className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-muted-foreground mx-auto">
        Search through thousands of podcasts and find your next favorite show
      </p>
    </div>
  );
}
