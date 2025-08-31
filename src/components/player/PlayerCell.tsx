import { useAppStore } from '@/store';
import { selectIsPlayingThis } from '@/store/player/selectors';
import PlayButton from './PlayButton';

type Props = { podcastId: number; episodeId?: number; className?: string };

function PlayerCell({ podcastId, episodeId, className }: Props) {
  const playing = useAppStore(selectIsPlayingThis(podcastId, episodeId));
  const playPodcastEpisode = useAppStore(state => state.playPodcastEpisode);
  const tryPlayLastEpisode = useAppStore(state => state.tryPlayLastEpisode);

  const onPlay = () => {
    if (episodeId) {
      playPodcastEpisode(podcastId, episodeId);
    } else {
      tryPlayLastEpisode(podcastId);
    }
  };

  return <PlayButton playing={playing} onPlay={onPlay} className={className} />;
}

export default PlayerCell;
