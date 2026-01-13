import { http, HttpResponse } from 'msw';
import { mockPodcasts, mockEpisodes } from './data';

export const handlers = [
  // Search podcasts
  http.get('/itunes/search', ({ request }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get('term');
    const entity = url.searchParams.get('entity');

    if (!term || entity !== 'podcast') {
      return HttpResponse.json({ results: [] });
    }

    // Filter podcasts by search term (case-insensitive)
    const filteredPodcasts = mockPodcasts.filter(podcast =>
      podcast.trackName.toLowerCase().includes(term.toLowerCase())
      || podcast.artistName.toLowerCase().includes(term.toLowerCase()),
    );

    return HttpResponse.json({
      resultCount: filteredPodcasts.length,
      results: filteredPodcasts,
    });
  }),

  // Lookup podcast episodes
  http.get('/itunes/lookup', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const entity = url.searchParams.get('entity');
    const limit = url.searchParams.get('limit');

    if (!id) {
      return HttpResponse.json({ results: [] });
    }

    const podcastId = Number.parseInt(id, 10);
    const podcast = mockPodcasts.find(p => p.trackId === podcastId);

    if (!podcast) {
      return HttpResponse.json({ results: [] });
    }

    // If entity is podcastEpisode, return podcast + episodes
    if (entity === 'podcastEpisode') {
      const episodeLimit = limit ? Number.parseInt(limit, 10) : 20;
      const limitedEpisodes = mockEpisodes.slice(0, episodeLimit);

      return HttpResponse.json({
        resultCount: limitedEpisodes.length + 1,
        results: [podcast, ...limitedEpisodes],
      });
    }

    // Otherwise just return the podcast
    return HttpResponse.json({
      resultCount: 1,
      results: [podcast],
    });
  }),
];
