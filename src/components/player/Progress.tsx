import { useAppStore } from '@/store';
import { memo, useMemo } from 'react';
import { calculateDuration } from '@/lib/dates';
import { Progress as LinearProgress } from '@/components/ui/progress';
import { useTrack } from './hooks/useTrack';

const getBarPercentage = (time = 0, duration = 0) => {
  if (!duration) return 0;
  const percentage = Math.round((time / duration) * 1000) / 10;
  return percentage;
};

const Progress = () => {
  const track = useTrack();
  const currentTime = useAppStore(state => state.currentTime);

  const startTime = calculateDuration(currentTime);
  const { duration } = track;
  const endTime = useMemo(() => calculateDuration(duration), [duration]);
  const percentage = getBarPercentage(currentTime, duration);

  return (
    <div className="flex mx-std items-center">
      <span className="w-14">{startTime}</span>
      <LinearProgress value={percentage} data-testid="progress-bar" />
      <span className="text-white w-14">{endTime}</span>
    </div>
  );
};

export default memo(Progress);
