export type Podcast = {
  id: number;
  name: string;
  author: string;
  genres: string;
  releaseDate: string;
  thumbnailUrl: string;
};

export const mockPodcasts: Podcast[] = [
  {
    id: 1,
    name: 'The Daily',
    author: 'The New York Times',
    genres: 'News, Podcasts',
    releaseDate: '2023-01-15',
    thumbnailUrl: 'https://picsum.photos/150?random=1',
  },
  {
    id: 2,
    name: 'Stuff You Should Know',
    author: 'iHeartRadio',
    genres: 'Education, Society & Culture, Podcasts',
    releaseDate: '2023-02-10',
    thumbnailUrl: 'https://picsum.photos/150?random=2',
  },
  {
    id: 3,
    name: 'Song Exploder',
    author: 'Hrishikesh Hirway',
    genres: 'Music, Podcasts',
    releaseDate: '2023-03-05',
    thumbnailUrl: 'https://picsum.photos/150?random=3',
  },
  {
    id: 4,
    name: 'Science Vs',
    author: 'Wendy Zukerman',
    genres: 'Science, Podcasts',
    releaseDate: '2023-04-20',
    thumbnailUrl: 'https://picsum.photos/150?random=4',
  },
  {
    id: 5,
    name: 'How I Built This',
    author: 'Guy Raz',
    genres: 'Business, Podcasts',
    releaseDate: '2023-05-30',
    thumbnailUrl: 'https://picsum.photos/150?random=5',
  },
];
