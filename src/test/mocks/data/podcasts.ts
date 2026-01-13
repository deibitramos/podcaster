import { ITunesResult } from '@/lib/itunes';

export const mockPodcasts: ITunesResult[] = [
  {
    kind: 'podcast',
    trackId: 1535809341,
    trackName: 'The JavaScript Podcast',
    artistName: 'JavaScript Experts',
    releaseDate: '2024-01-15T00:00:00Z',
    trackTimeMillis: 0,
    description: 'A podcast about JavaScript, web development, and more.',
    episodeUrl: '',
    genres: ['Technology', 'Software How-To'],
    artworkUrl60: 'https://example.com/artwork-60.jpg',
    artworkUrl160: 'https://example.com/artwork-160.jpg',
  },
  {
    kind: 'podcast',
    trackId: 1535809342,
    trackName: 'React Weekly',
    artistName: 'React Developers',
    releaseDate: '2024-02-01T00:00:00Z',
    trackTimeMillis: 0,
    description: 'Weekly discussions about React and frontend development.',
    episodeUrl: '',
    genres: ['Technology', 'Education'],
    artworkUrl60: 'https://example.com/react-artwork-60.jpg',
    artworkUrl160: 'https://example.com/react-artwork-160.jpg',
  },
];
