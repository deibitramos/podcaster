import { memo } from 'react';

import PlayButton from './PlayButton';
import { selectControlsActions, selectControlsState } from '@/store/player/selectors';
import { useShallowAppStore } from '@/store';
import { Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '../ui/button';

const repeatIcons = {
  NO: <RepeatIcon data-testid="repeat-no" />,
  ALL: <RepeatIcon className="text-black bg-white" data-testid="repeat-all" />,
  ONE: <Repeat1Icon className="text-black bg-white" data-testid="repeat-one" />,
};

const Controls = () => {
  const { playing, shuffle, repeat, disableNext, disablePrevious, disableShuffle }
    = useShallowAppStore(selectControlsState);
  const { play, setShuffle, prevTrack, nextTrack, setRepeat }
    = useShallowAppStore(selectControlsActions);

  const shuffleIcon = <ShuffleIcon className={cn(shuffle ? 'text-black bg-white' : '')} />;
  const repeatIcon = repeatIcons[repeat];
  const isPlaying = playing === 'PLAYING';

  return (
    <div className="grid grid-cols-controls gap-5 items-center mx-std">
      <Button
        className="size-10"
        onClick={setShuffle}
        disabled={disableShuffle}
        data-testid="shuffle-btn"
      >
        {shuffleIcon}
      </Button>
      <Button
        className="size-10"
        onClick={prevTrack}
        disabled={disablePrevious}
        data-testid="prev-track-btn"
      >
        <SkipBackIcon />
      </Button>
      <PlayButton className="w-[50px] h-[50px]" onPlay={play} playing={isPlaying} />
      <Button
        className="size-10"
        onClick={nextTrack}
        disabled={disableNext}
        data-testid="next-track-btn"
      >
        <SkipForwardIcon />
      </Button>
      <Button onClick={setRepeat} data-testid="repeat-btn">
        {repeatIcon}
      </Button>
    </div>
  );
};

export default memo(Controls);
