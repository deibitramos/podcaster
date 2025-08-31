import { useQueryClient } from '@tanstack/react-query';
import { useTrack } from './useTrack';
import { findCurrentInCache } from '@/api/episodes';

function useGetPlayingData() {
  const track = useTrack();
  const qc = useQueryClient();
  const current = findCurrentInCache(qc, track.podcastId);

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
