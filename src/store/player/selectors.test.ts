import { describe, it, expect } from 'vitest';
import { selectIsPlayingThis, selectControlsState, selectControlsActions } from './selectors';
import { PlayerSlice } from './types';

describe('player selectors', () => {
  const createMockSlice = (overrides?: Partial<PlayerSlice>): PlayerSlice => ({
    requestPodcastId: 123,
    requestEpisodeId: 1,
    playlistEpisodeIds: [1, 2, 3],
    currentIndex: 0,
    volume: 50,
    currentTime: 0,
    playState: 'PLAYING',
    repeat: 'NO',
    shuffle: false,
    playPodcastEpisode: vi.fn(),
    tryPlayLastEpisode: vi.fn(),
    retryPlayLastEpisode: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    nextTrack: vi.fn(),
    prevTrack: vi.fn(),
    setCurrentTime: vi.fn(),
    setRepeat: vi.fn(),
    setShuffle: vi.fn(),
    setVolume: vi.fn(),
    ...overrides,
  });

  describe('selectIsPlayingThis', () => {
    it('should return true when playing matching podcast and episode', () => {
      const slice = createMockSlice({
        requestPodcastId: 123,
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 0,
        playState: 'PLAYING',
      });

      const selector = selectIsPlayingThis(123, 1);
      expect(selector(slice)).toBe(true);
    });

    it('should return true when playing matching podcast without episode check', () => {
      const slice = createMockSlice({
        requestPodcastId: 123,
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 0,
        playState: 'PLAYING',
      });

      const selector = selectIsPlayingThis(123);
      expect(selector(slice)).toBe(true);
    });

    it('should return false when not playing', () => {
      const slice = createMockSlice({
        playState: 'PAUSED',
      });

      const selector = selectIsPlayingThis(123, 1);
      expect(selector(slice)).toBe(false);
    });

    it('should return false when podcast id does not match', () => {
      const slice = createMockSlice({
        requestPodcastId: 999,
      });

      const selector = selectIsPlayingThis(123, 1);
      expect(selector(slice)).toBe(false);
    });

    it('should return false when episode id does not match', () => {
      const slice = createMockSlice({
        requestPodcastId: 123,
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 1, // Playing episode 2
      });

      const selector = selectIsPlayingThis(123, 1); // Looking for episode 1
      expect(selector(slice)).toBe(false);
    });

    it('should return false when current index is -1', () => {
      const slice = createMockSlice({
        currentIndex: -1,
      });

      const selector = selectIsPlayingThis(123, 1);
      expect(selector(slice)).toBe(false);
    });
  });

  describe('selectControlsState', () => {
    it('should return controls state for normal playback', () => {
      const slice = createMockSlice({
        playState: 'PLAYING',
        shuffle: false,
        repeat: 'NO',
        currentIndex: 1,
        playlistEpisodeIds: [1, 2, 3],
      });

      const result = selectControlsState(slice);

      expect(result).toEqual({
        playing: 'PLAYING',
        shuffle: false,
        repeat: 'NO',
        disableShuffle: false,
        disableNext: false,
        disablePrevious: false,
      });
    });

    it('should disable shuffle for single track', () => {
      const slice = createMockSlice({
        playlistEpisodeIds: [1],
        currentIndex: 0,
      });

      const result = selectControlsState(slice);
      expect(result.disableShuffle).toBe(true);
    });

    it('should disable next when at last track with repeat NO', () => {
      const slice = createMockSlice({
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 2,
        repeat: 'NO',
      });

      const result = selectControlsState(slice);
      expect(result.disableNext).toBe(true);
    });

    it('should not disable next when at last track with repeat ALL', () => {
      const slice = createMockSlice({
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 2,
        repeat: 'ALL',
      });

      const result = selectControlsState(slice);
      expect(result.disableNext).toBe(false);
    });

    it('should disable previous when at first track with repeat NO', () => {
      const slice = createMockSlice({
        playlistEpisodeIds: [1, 2, 3],
        currentIndex: 0,
        repeat: 'NO',
      });

      const result = selectControlsState(slice);
      expect(result.disablePrevious).toBe(true);
    });

    it('should disable previous when shuffle is enabled', () => {
      const slice = createMockSlice({
        shuffle: true,
        currentIndex: 1,
      });

      const result = selectControlsState(slice);
      expect(result.disablePrevious).toBe(true);
    });
  });

  describe('selectControlsActions', () => {
    it('should return action functions', () => {
      const slice = createMockSlice();
      const result = selectControlsActions(slice);

      expect(result).toHaveProperty('play');
      expect(result).toHaveProperty('setShuffle');
      expect(result).toHaveProperty('setRepeat');
      expect(result).toHaveProperty('nextTrack');
      expect(result).toHaveProperty('prevTrack');

      expect(typeof result.play).toBe('function');
      expect(typeof result.setShuffle).toBe('function');
      expect(typeof result.setRepeat).toBe('function');
      expect(typeof result.nextTrack).toBe('function');
      expect(typeof result.prevTrack).toBe('function');
    });
  });
});
