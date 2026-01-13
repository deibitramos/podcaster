import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../index';
import { qc } from '@/qc';
import { PodcastWithEpisodes } from '@/api/episodes';

describe('player actions', () => {
  beforeEach(() => {
    // Clear query cache before each test
    qc.clear();
  });

  describe('play, pause, stop', () => {
    it('should play', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.play();
      });

      expect(result.current.playState).toBe('PLAYING');
    });

    it('should pause', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.play();
        result.current.pause();
      });

      expect(result.current.playState).toBe('PAUSED');
    });

    it('should stop', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.play();
        result.current.stop();
      });

      expect(result.current.playState).toBe('STOPPED');
    });
  });

  describe('setVolume', () => {
    it('should update volume', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setVolume(75);
      });

      expect(result.current.volume).toBe(75);
    });

    it('should accept values from 0 to 100', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setVolume(0);
      });
      expect(result.current.volume).toBe(0);

      act(() => {
        result.current.setVolume(100);
      });
      expect(result.current.volume).toBe(100);
    });
  });

  describe('setCurrentTime', () => {
    it('should update current time', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setCurrentTime(45.5);
      });

      expect(result.current.currentTime).toBe(45.5);
    });
  });

  describe('setRepeat', () => {
    it('should cycle through repeat modes', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.repeat).toBe('NO');

      act(() => {
        result.current.setRepeat();
      });
      expect(result.current.repeat).toBe('ALL');

      act(() => {
        result.current.setRepeat();
      });
      expect(result.current.repeat).toBe('ONE');

      act(() => {
        result.current.setRepeat();
      });
      expect(result.current.repeat).toBe('NO');
    });
  });

  describe('setShuffle', () => {
    it('should toggle shuffle', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.shuffle).toBe(false);

      act(() => {
        result.current.setShuffle();
      });
      expect(result.current.shuffle).toBe(true);

      act(() => {
        result.current.setShuffle();
      });
      expect(result.current.shuffle).toBe(false);
    });
  });

  describe('playPodcastEpisode', () => {
    it('should set up playlist and play episode', () => {
      const { result } = renderHook(() => useAppStore());

      // Set up mock data in query cache
      const mockData: PodcastWithEpisodes = {
        podcast: {
          id: 123,
          name: 'Test Podcast',
          author: 'Test Author',
          genres: 'Technology',
          releaseDate: '2024-01-01',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        },
        episodes: [
          {
            id: 1,

            title: 'Episode 1',
            releaseDate: '2024-01-01',
            description: 'First episode',
            duration: 1800,
            url: 'https://example.com/ep1.mp3',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            imageUrl: 'https://example.com/img1.jpg',
          },
          {
            id: 2,

            title: 'Episode 2',
            releaseDate: '2024-01-02',
            description: 'Second episode',
            duration: 2400,
            url: 'https://example.com/ep2.mp3',
            thumbnailUrl: 'https://example.com/thumb2.jpg',
            imageUrl: 'https://example.com/img2.jpg',
          },
        ],
      };

      qc.setQueryData(['episodes', 123], mockData);

      act(() => {
        result.current.playPodcastEpisode(123, 2);
      });

      expect(result.current.requestPodcastId).toBe(123);
      expect(result.current.requestEpisodeId).toBe(2);
      expect(result.current.playlistEpisodeIds).toEqual([1, 2]);
      expect(result.current.currentIndex).toBe(1); // Second episode is at index 1
      expect(result.current.playState).toBe('PLAYING');
    });
  });

  describe('retryPlayLastEpisode', () => {
    it('should retry playing an episode', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.retryPlayLastEpisode(42);
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.playlistEpisodeIds).toEqual([42]);
      expect(result.current.playState).toBe('PLAYING');
    });
  });

  describe('nextTrack and prevTrack', () => {
    it('should move to next track', () => {
      const { result } = renderHook(() => useAppStore());

      // Set up mock data
      const mockData: PodcastWithEpisodes = {
        podcast: {
          id: 123,
          name: 'Test Podcast',
          author: 'Test Author',
          genres: 'Technology',
          releaseDate: '2024-01-01',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        },
        episodes: [
          {
            id: 1,

            title: 'Episode 1',
            releaseDate: '2024-01-01',
            description: 'First episode',
            duration: 1800,
            url: 'https://example.com/ep1.mp3',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            imageUrl: 'https://example.com/img1.jpg',
          },
          {
            id: 2,

            title: 'Episode 2',
            releaseDate: '2024-01-02',
            description: 'Second episode',
            duration: 2400,
            url: 'https://example.com/ep2.mp3',
            thumbnailUrl: 'https://example.com/thumb2.jpg',
            imageUrl: 'https://example.com/img2.jpg',
          },
          {
            id: 3,

            title: 'Episode 3',
            releaseDate: '2024-01-03',
            description: 'Third episode',
            duration: 3000,
            url: 'https://example.com/ep3.mp3',
            thumbnailUrl: 'https://example.com/thumb3.jpg',
            imageUrl: 'https://example.com/img3.jpg',
          },
        ],
      };

      qc.setQueryData(['episodes', 123], mockData);

      act(() => {
        result.current.playPodcastEpisode(123, 1);
      });

      expect(result.current.currentIndex).toBe(0);

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.requestEpisodeId).toBe(2);
    });

    it('should move to previous track', () => {
      const { result } = renderHook(() => useAppStore());

      // Set up mock data (reusing from previous test)
      const mockData: PodcastWithEpisodes = {
        podcast: {
          id: 123,
          name: 'Test Podcast',
          author: 'Test Author',
          genres: 'Technology',
          releaseDate: '2024-01-01',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        },
        episodes: [
          {
            id: 1,

            title: 'Episode 1',
            releaseDate: '2024-01-01',
            description: 'First episode',
            duration: 1800,
            url: 'https://example.com/ep1.mp3',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            imageUrl: 'https://example.com/img1.jpg',
          },
          {
            id: 2,

            title: 'Episode 2',
            releaseDate: '2024-01-02',
            description: 'Second episode',
            duration: 2400,
            url: 'https://example.com/ep2.mp3',
            thumbnailUrl: 'https://example.com/thumb2.jpg',
            imageUrl: 'https://example.com/img2.jpg',
          },
        ],
      };

      qc.setQueryData(['episodes', 123], mockData);

      act(() => {
        result.current.playPodcastEpisode(123, 2);
      });

      expect(result.current.currentIndex).toBe(1);

      act(() => {
        result.current.prevTrack();
      });

      expect(result.current.currentIndex).toBe(0);
      expect(result.current.requestEpisodeId).toBe(1);
    });
  });
});
