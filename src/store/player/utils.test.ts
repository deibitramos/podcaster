import { describe, it, expect } from 'vitest';
import { getNextRepeat, changeTrack } from './utils';
import { PlayerState } from './types';

describe('player utils', () => {
  describe('getNextRepeat', () => {
    it('should cycle through repeat modes', () => {
      expect(getNextRepeat('NO')).toBe('ALL');
      expect(getNextRepeat('ALL')).toBe('ONE');
      expect(getNextRepeat('ONE')).toBe('NO');
    });
  });

  describe('changeTrack', () => {
    const createBaseState = (): PlayerState => ({
      requestPodcastId: 123,
      requestEpisodeId: 1,
      playlistEpisodeIds: [1, 2, 3, 4, 5],
      currentIndex: 2,
      volume: 50,
      currentTime: 0,
      playState: 'PLAYING',
      repeat: 'NO',
      shuffle: false,
    });

    describe('with empty playlist', () => {
      it('should stop playback', () => {
        const state = { ...createBaseState(), playlistEpisodeIds: [], currentIndex: -1 };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(-1);
        expect('playState' in result && result.playState).toBe('STOPPED');
        expect('requestPodcastId' in result && result.requestPodcastId).toBe(0);
        expect('requestEpisodeId' in result && result.requestEpisodeId).toBeUndefined();
        expect('playlistEpisodeIds' in result && result.playlistEpisodeIds).toEqual([]);
      });
    });

    describe('with repeat ONE', () => {
      it('should stay on same track when going next', () => {
        const state = { ...createBaseState(), repeat: 'ONE' as const };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(2);
        expect(result.currentTime).toBe(0);
        expect(result.requestEpisodeId).toBe(3);
      });

      it('should stay on same track when going previous', () => {
        const state = { ...createBaseState(), repeat: 'ONE' as const };
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBe(2);
        expect(result.currentTime).toBe(0);
      });
    });

    describe('with shuffle enabled', () => {
      it('should select random track when going next', () => {
        const state = { ...createBaseState(), shuffle: true };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBeGreaterThanOrEqual(0);
        expect(result.currentIndex).toBeLessThan(5);
        expect(result.currentTime).toBe(0);
      });

      it('should select random track when going previous', () => {
        const state = { ...createBaseState(), shuffle: true };
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBeGreaterThanOrEqual(0);
        expect(result.currentIndex).toBeLessThan(5);
      });
    });

    describe('with repeat NO', () => {
      it('should move to next track', () => {
        const state = createBaseState();
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(3);
        expect(result.requestEpisodeId).toBe(4);
        expect(result.currentTime).toBe(0);
      });

      it('should move to previous track', () => {
        const state = createBaseState();
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBe(1);
        expect(result.requestEpisodeId).toBe(2);
      });

      it('should stop when at last track and going next', () => {
        const state = { ...createBaseState(), currentIndex: 4 };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(-1);
        expect('playState' in result && result.playState).toBe('STOPPED');
      });

      it('should stop when at first track and going previous', () => {
        const state = { ...createBaseState(), currentIndex: 0 };
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBe(-1);
        expect('playState' in result && result.playState).toBe('STOPPED');
      });
    });

    describe('with repeat ALL', () => {
      it('should move to next track normally', () => {
        const state = { ...createBaseState(), repeat: 'ALL' as const };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(3);
        expect(result.requestEpisodeId).toBe(4);
      });

      it('should wrap to first track when at end', () => {
        const state = { ...createBaseState(), repeat: 'ALL' as const, currentIndex: 4 };
        const result = changeTrack(state, true);

        expect(result.currentIndex).toBe(0);
        expect(result.requestEpisodeId).toBe(1);
      });

      it('should move to previous track normally', () => {
        const state = { ...createBaseState(), repeat: 'ALL' as const };
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBe(1);
        expect(result.requestEpisodeId).toBe(2);
      });

      it('should wrap to last track when at beginning', () => {
        const state = { ...createBaseState(), repeat: 'ALL' as const, currentIndex: 0 };
        const result = changeTrack(state, false);

        expect(result.currentIndex).toBe(4);
        expect(result.requestEpisodeId).toBe(5);
      });
    });
  });
});
