import { ITunesResult } from '@/lib/itunes';

export const mockEpisodes: ITunesResult[] = [
  {
    kind: 'podcast-episode',
    trackId: 1000001,
    trackName: 'Introduction to Modern JavaScript',
    artistName: 'JavaScript Experts',
    releaseDate: '2024-01-20T12:00:00Z',
    trackTimeMillis: 1800000, // 30 minutes
    description: 'An introduction to ES6+ features and modern JavaScript practices.',
    episodeUrl: 'https://example.com/episodes/episode1.mp3',
    genres: ['Technology'],
    artworkUrl60: 'https://example.com/episode1-60.jpg',
    artworkUrl160: 'https://example.com/episode1-160.jpg',
  },
  {
    kind: 'podcast-episode',
    trackId: 1000002,
    trackName: 'Async/Await Deep Dive',
    artistName: 'JavaScript Experts',
    releaseDate: '2024-01-27T12:00:00Z',
    trackTimeMillis: 2400000, // 40 minutes
    description: 'Understanding asynchronous JavaScript with async/await.',
    episodeUrl: 'https://example.com/episodes/episode2.mp3',
    genres: ['Technology'],
    artworkUrl60: 'https://example.com/episode2-60.jpg',
    artworkUrl160: 'https://example.com/episode2-160.jpg',
  },
  {
    kind: 'podcast-episode',
    trackId: 1000003,
    trackName: 'JavaScript Performance Optimization',
    artistName: 'JavaScript Experts',
    releaseDate: '2024-02-03T12:00:00Z',
    trackTimeMillis: 2700000, // 45 minutes
    description: 'Tips and tricks for optimizing JavaScript performance.',
    episodeUrl: 'https://example.com/episodes/episode3.mp3',
    genres: ['Technology'],
    artworkUrl60: 'https://example.com/episode3-60.jpg',
    artworkUrl160: 'https://example.com/episode3-160.jpg',
  },
];
