import PlayerCell from '@/components/player/PlayerCell';
import { useParams } from '@tanstack/react-router';

type Props = { episodeId: number };

function EpisodePlayerCell({ episodeId }: Props) {
  const { id } = useParams({ from: '/podcast/$id' });
  return <PlayerCell podcastId={id} episodeId={episodeId} />;
}

export default EpisodePlayerCell;
