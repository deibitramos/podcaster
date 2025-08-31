import { useAppStore } from '@/store';
import { Button } from '../ui/button';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = { playing: boolean; onPlay: () => void; className?: string };

function PlayButton({ playing, onPlay, className, ...props }: Props) {
  const pause = useAppStore(state => state.pause);

  const onInternalClick = () => {
    if (playing) {
      pause();
    } else {
      onPlay();
    }
  };

  return (
    <Button
      size="icon"
      className={cn(
        'rounded-full p-0 transition-colors duration-300',
        'flex items-center justify-center',
        className,
      )}
      onClick={onInternalClick}
      {...props}
      data-testid="play-pause-button"
    >
      {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
    </Button>
  );
}

export default PlayButton;
