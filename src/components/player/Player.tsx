import { useAppStore } from '@/store';
import { cn } from '@/lib/cn';
import PlayerContent from './PlayerContent';
import PlayerProvider from './PlayerProvider';

export default function Player() {
  const trackRequested = useAppStore(state => state.requestPodcastId !== 0);

  return (
    <div
      className={cn(
        'fixed bottom-0 h-28 w-full pr-4 bg-bg-gray z-50',
        'transition-transform duration-800 ease-in-out',
        trackRequested ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      {trackRequested && (
        <PlayerProvider>
          <PlayerContent />
        </PlayerProvider>
      )}
    </div>
  );
}
