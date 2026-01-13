import { describe, it, expect } from 'vitest';
import { transformITunesResults, ITunesResults, ItunesError } from './itunes';
import { AppError, ErrorType } from './errors';

describe('itunes utilities', () => {
  describe('transformITunesResults', () => {
    it('should return results array for valid data', () => {
      const data: ITunesResults = {
        results: [
          {
            kind: 'podcast',
            trackId: 123,
            trackName: 'Test Podcast',
            artistName: 'Test Artist',
            releaseDate: '2024-01-01T00:00:00Z',
            trackTimeMillis: 0,
            description: 'Test description',
            episodeUrl: '',
            genres: ['Technology'],
            artworkUrl60: 'https://example.com/art-60.jpg',
            artworkUrl160: 'https://example.com/art-160.jpg',
          },
        ],
      };

      const result = transformITunesResults(data);
      expect(result).toEqual(data.results);
      expect(result).toHaveLength(1);
      expect(result[0].trackName).toBe('Test Podcast');
    });

    it('should return empty array for empty results', () => {
      const data: ITunesResults = { results: [] };
      const result = transformITunesResults(data);
      expect(result).toEqual([]);
    });

    it('should throw AppError for error response', () => {
      const errorData: ItunesError = {
        errorMessage: 'Invalid request',
      };

      expect(() => transformITunesResults(errorData)).toThrow(AppError);
      expect(() => transformITunesResults(errorData))
        .toThrow('iTunes API error: Invalid request');
    });

    it('should throw network error type', () => {
      const errorData: ItunesError = {
        errorMessage: 'Network error',
      };

      try {
        transformITunesResults(errorData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        if (error instanceof AppError) {
          expect(error.type).toBe(ErrorType.NETWORK);
        }
      }
    });
  });
});
