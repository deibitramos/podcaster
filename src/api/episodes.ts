import axios from 'axios';
import { ITunesResult, ITunesResults, transformITunesResults } from '@/lib/itunes';
import { mapPodcast } from './podcasts';
import { Episode, Podcast } from '@/entities';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { AppError, assertExists } from '@/lib/errors';

export type PodcastWithEpisodes = { podcast: Podcast; episodes: Episode[] };

const fetchEpisodes = async (podcastId: number, options?: { top1?: boolean }) => {
  const { top1 = false } = options ?? {};
  const limit = encodeURIComponent(top1 ? 1 : 20);
  const url = `/itunes/lookup?id=${podcastId}&entity=podcastEpisode&limit=${limit}`;
  const { data } = await axios.get<ITunesResults>(url);

  const episodeData = transformITunesResults(data);
  if (!episodeData.length) {
    throw AppError.notFound('Podcast', podcastId);
  }
  return transformEpisodes(episodeData);
};

export const query = {
  episodes: (podcastId: number) => queryOptions({
    queryKey: ['episodes', podcastId],
    queryFn: () => fetchEpisodes(podcastId),
  }),
  lastEpisode: (podcastId: number) => queryOptions({
    queryKey: ['episodes', podcastId, true],
    queryFn: () => fetchEpisodes(podcastId, { top1: true }),
  }),
};

export const findEpisodeInCache = (qc: QueryClient, podcastId: number, episodeId?: number) => {
  const queriesData = qc.getQueriesData<PodcastWithEpisodes>({
    queryKey: ['episodes', podcastId],
  });
  const [, result] = queriesData.find(([, data]) =>
    (data?.episodes.some(e => !episodeId || e.id === episodeId)),
  ) ?? [];
  return result;
};

const transformEpisodes = (itunesData: ITunesResult[]): PodcastWithEpisodes => {
  const podcastInfo = itunesData.find(data => data.kind === 'podcast');
  assertExists(podcastInfo);

  const podcast = mapPodcast(podcastInfo);
  const episodes: Episode[] = itunesData
    .filter(e => e.kind === 'podcast-episode')
    .map(e => ({
      id: e.trackId,
      podcastId: podcast.id,
      title: e.trackName,
      releaseDate: e.releaseDate,
      description: e.description,
      duration: (e.trackTimeMillis || 0) / 1000,
      url: e.episodeUrl,
      thumbnailUrl: e.artworkUrl60,
      imageUrl: e.artworkUrl160,
    }));

  return { podcast, episodes };
};
