import { useQueryClient } from '@tanstack/react-query';
import { useTrack } from './useTrack';
import { findEpisodeInCache } from '@/api/episodes';
import { assertExists } from '@/lib/errors';

function useGetPlayingData() {
  const track = useTrack();
  const qc = useQueryClient();
  const podcastWithEpisodes = findEpisodeInCache(qc, track.podcastId, track.episodeId);
  assertExists(podcastWithEpisodes, 'podcastWithEpisodes');

  const { podcast, episodes } = podcastWithEpisodes;
  const episode = episodes.find(e => e.id === track.episodeId);
  assertExists(episode, 'episode');

  return { podcast, episode };
}

export default useGetPlayingData;
