import { AppError } from './errors';

export type ItunesError = {
  errorMessage: string;
};

export type ITunesResult = {
  kind: string;
  trackId: number;
  trackName: string;
  artistName: string;
  releaseDate: string;
  trackTimeMillis: number;
  description: string;
  episodeUrl: string;
  genres: string[];
  artworkUrl60: string;
  artworkUrl160: string;
};

export type ITunesResults = {
  results: ITunesResult[];
};

export const transformITunesResults = (data: ITunesResults | ItunesError) => {
  if ('errorMessage' in data) {
    throw AppError.network(`iTunes API error: ${data.errorMessage}`);
  }

  return data.results;
};
