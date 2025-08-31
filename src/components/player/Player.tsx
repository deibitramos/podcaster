import { useAppStore } from '@/store';
import { Drawer, DrawerContent } from '../ui/drawer';
import { cn } from '@/lib/cn';
import Controls from './Controls';
import Progress from './Progress';
import Volume from './Volume';
import PlayerProvider from './PlayerProvider';
import useGetPlayingData from './hooks/useGetCurrentData';

function PlayerContent() {
  const { podcast, episode } = useGetPlayingData();
  return (
    <>
      <img className="w-full h-full" src={episode.imageUrl} alt={episode.title} />
      <div className="flex flex-col mr-4 leading-5">
        <span className="text-white leading-5">{episode.title}</span>
        <span className="leading-5">{podcast.author}</span>
      </div>
      <Controls />
      <Progress />
      <Volume />
    </>
  );
}

export default function Player() {
  const trackRequested = useAppStore(state => state.requestPodcastId !== 0);

  return (
    <Drawer open={trackRequested}>
      <DrawerContent>
        <div className={cn('fixed bottom-0 h-28 w-full pr-4 bg-bg-gray',
          'grid grid-cols-player-short lg:grid-cols-player-long gap-5 items-center')}
        >
          <PlayerProvider>
            <PlayerContent />
          </PlayerProvider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
