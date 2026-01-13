import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { ITunesResults } from '@/lib/itunes';

describe('MSW Integration', () => {
  it('should mock podcast search requests', async () => {
    const response = await axios.get<ITunesResults>(
      '/itunes/search?entity=podcast&term=javascript',
    );

    expect(response.status).toBe(200);
    expect(response.data.results).toBeDefined();
    expect(response.data.results.length).toBeGreaterThan(0);
    expect(response.data.results[0].trackName).toBe('The JavaScript Podcast');
  });

  it('should return empty results for non-matching search', async () => {
    const response = await axios.get<ITunesResults>(
      '/itunes/search?entity=podcast&term=nonexistent',
    );

    expect(response.status).toBe(200);
    expect(response.data.results).toEqual([]);
  });

  it('should mock episode lookup requests', async () => {
    const response = await axios.get<ITunesResults>(
      '/itunes/lookup?id=1535809341&entity=podcastEpisode&limit=20',
    );

    expect(response.status).toBe(200);
    expect(response.data.results).toBeDefined();
    expect(response.data.results.length).toBeGreaterThan(0);
    // First result should be the podcast, followed by episodes
    expect(response.data.results[0].kind).toBe('podcast');
  });
});
