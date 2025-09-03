import { cn } from '@/lib/cn';
import Controls from './Controls';
import Progress from './Progress';
import Volume from './Volume';
import useGetPlayingData from './hooks/useGetPlayingData';

export default function PlayerContent() {
  const { podcast, episode } = useGetPlayingData();

  return (
    <div
      className={cn('py-2 grid grid-cols-player-init sm:grid-cols-player-sm lg:grid-cols-player-lg',
        'gap-2 sm:gap-5 items-center h-full')}
    >
      <img
        className="w-full row-span-2 sm:row-span-1"
        src={episode.imageUrl}
        alt={episode.title}
      />
      <div className="flex flex-col mr-4 leading-5">
        <span className="text-white leading-5">{episode.title}</span>
        <span className="leading-5">{podcast.author}</span>
      </div>
      <Controls />
      <div className="hidden lg:grid lg:grid-cols-[1fr_135px] pr-8">
        <Progress />
        <Volume />
      </div>
    </div>
  );
}
