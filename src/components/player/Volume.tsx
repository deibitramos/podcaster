import { memo } from 'react';
import { useAppStore } from '@/store';
import { Slider } from '../ui/slider';
import { Volume2Icon } from 'lucide-react';

const Volume = () => {
  const volume = useAppStore(state => state.volume);
  const setVolume = useAppStore(state => state.setVolume);

  const onChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  return (
    <div className="flex items-center">
      <Volume2Icon className="text-white" />
      <Slider value={[volume]} onValueChange={onChange} />
    </div>
  );
};

export default memo(Volume);
