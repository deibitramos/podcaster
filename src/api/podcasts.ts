import axios from 'axios';
import { Podcast } from '@/entities';
import { ITunesResult, ITunesResults, transformITunesResults } from '@/lib/itunes';
import { queryOptions } from '@tanstack/react-query';

export const query = {
  podcasts: (term: string) => queryOptions({
    queryKey: ['podcasts', term],
    queryFn: () => fetchPodcasts(term),
  }),
};

export const mapPodcast = (p: ITunesResult): Podcast => ({
  id: p.trackId,
  name: p.trackName,
  author: p.artistName,
  genres: p.genres.join(', '),
  releaseDate: p.releaseDate,
  thumbnailUrl: p.artworkUrl60,
});

const fetchPodcasts = async (term: string): Promise<Podcast[]> => {
  const url = `/itunes/search?entity=podcast&limit=10&term=${encodeURIComponent(term)}`;
  const { data } = await axios.get<ITunesResults>(url);
  const podcasts = transformITunesResults(data);
  return podcasts.map(mapPodcast);
};
