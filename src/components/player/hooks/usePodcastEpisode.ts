import { Episode } from '@/entities';
import { PodcastWithEpisodes, query } from '@/api/episodes';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppStore } from '@/store';

function usePodcastEpisode(podcastId: number, episodeId: number | undefined) {
  const queryClient = useQueryClient();
  const retryPlayLastEpisode = useAppStore(state => state.retryPlayLastEpisode);

  const cacheData = queryClient.getQueryData<PodcastWithEpisodes>(['episodes', podcastId]);
  const { episodes } = cacheData ?? {};

  let currentEpisode: Episode | undefined;
  if (episodes?.length) {
    currentEpisode = episodeId ? episodes.find(e => e.id === episodeId) : episodes[0];
  }

  const { isFetching, error, data } = useQuery({
    ...query.lastEpisode(podcastId),
    enabled: !currentEpisode,
  });

  const fetchedEpisode = data?.episodes[0];

  useEffect(() => {
    if (fetchedEpisode) {
      retryPlayLastEpisode(fetchedEpisode.id);
    }
  }, [fetchedEpisode]);

  return { episode: currentEpisode ?? fetchedEpisode, isFetching, error };
}

export default usePodcastEpisode;
