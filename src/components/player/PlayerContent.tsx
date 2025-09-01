import Controls from './Controls';
import Progress from './Progress';
import Volume from './Volume';
import useGetPlayingData from './hooks/useGetPlayingData';

export default function PlayerContent() {
  const { podcast, episode } = useGetPlayingData();

  return (
    <div
      className="grid grid-cols-player-short lg:grid-cols-player-long gap-5 items-center h-full"
    >
      <img className="w-full h-full" src={episode.imageUrl} alt={episode.title} />
      <div className="flex flex-col mr-4 leading-5">
        <span className="text-white leading-5">{episode.title}</span>
        <span className="leading-5">{podcast.author}</span>
      </div>
      <Controls />
      <Progress />
      <Volume />
    </div>
  );
}
