import { memo } from 'react';

import PlayButton from './PlayButton';
import { selectControlsActions, selectControlsState } from '@/store/player/selectors';
import { useShallowAppStore } from '@/store';
import { Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '../ui/button';

const repeatIcons = {
  NO: <RepeatIcon data-testid="repeat-no" />,
  ALL: <RepeatIcon className="text-primary" data-testid="repeat-all" />,
  ONE: <Repeat1Icon className="text-primary" data-testid="repeat-one" />,
};

const Controls = () => {
  const { playing, shuffle, repeat, disableNext, disablePrevious, disableShuffle }
    = useShallowAppStore(selectControlsState);
  const { play, setShuffle, prevTrack, nextTrack, setRepeat }
    = useShallowAppStore(selectControlsActions);

  const shuffleIcon = <ShuffleIcon className={cn(shuffle ? 'text-primary' : '')} />;
  const repeatIcon = repeatIcons[repeat];
  const isPlaying = playing === 'PLAYING';

  return (
    <div className={cn('grid grid-cols-controls gap-2 sm:gap-4 px-1 sm:px-4',
      'items-center justify-center')}
    >
      <Button
        className={cn('size-10', shuffle && 'bg-accent hover:bg-accent/80')}
        variant="ghost"
        onClick={setShuffle}
        disabled={disableShuffle}
        data-testid="shuffle-btn"
      >
        {shuffleIcon}
      </Button>
      <Button
        className="size-10"
        variant="ghost"
        onClick={prevTrack}
        disabled={disablePrevious}
        data-testid="prev-track-btn"
      >
        <SkipBackIcon />
      </Button>
      <PlayButton className="w-12 h-12" onPlay={play} playing={isPlaying} />
      <Button
        className="size-10"
        variant="ghost"
        onClick={nextTrack}
        disabled={disableNext}
        data-testid="next-track-btn"
      >
        <SkipForwardIcon />
      </Button>
      <Button
        className={cn('size-10', repeat !== 'NO' && 'bg-accent hover:bg-accent/80')}
        variant="ghost"
        onClick={setRepeat}
        data-testid="repeat-btn"
      >
        {repeatIcon}
      </Button>
    </div>
  );
};

export default memo(Controls);
