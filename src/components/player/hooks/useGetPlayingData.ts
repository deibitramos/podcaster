import { useQueryClient } from '@tanstack/react-query';
import { useTrack } from './useTrack';
import { findEpisodeInCache } from '@/api/episodes';

function useGetPlayingData() {
  const track = useTrack();
  const qc = useQueryClient();
  const current = findEpisodeInCache(qc, track.podcastId, track.episodeId);

  if (!current) {
    throw new Error('Current episode not found');
  }

  const { podcast, episodes } = current;
  const episode = episodes.find(e => e.id === track.episodeId);
  if (!episode) {
    throw new Error('Current episode not found');
  }

  return { podcast, episode };
}

export default useGetPlayingData;
