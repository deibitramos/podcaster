import { PlayerSlice } from './types';

export const selectIsPlayingThis = (podcastId: number, episodeId?: number) =>
  (slice: PlayerSlice) => {
    if (slice.playState !== 'PLAYING' || slice.currentIndex === -1
      || slice.requestPodcastId !== podcastId)
      return false;

    const currentEpisodeId = slice.playlistEpisodeIds[slice.currentIndex];
    return episodeId ? currentEpisodeId === episodeId : slice.currentIndex === 0;
  };

export const selectControlsState = (slice: PlayerSlice) => {
  const { currentIndex, playState: playing, shuffle, repeat, playlistEpisodeIds } = slice;
  const currentLast = currentIndex === playlistEpisodeIds.length - 1;

  const disableShuffle = playlistEpisodeIds.length < 2;
  const disableNext = currentLast && repeat === 'NO';
  const disablePrevious = shuffle || (currentIndex === 0 && repeat === 'NO');

  return { playing, shuffle, repeat, disableShuffle, disableNext, disablePrevious };
};

export const selectControlsActions = (slice: PlayerSlice) => {
  const { play, setShuffle, setRepeat, nextTrack, prevTrack } = slice;
  return { play, setShuffle, setRepeat, nextTrack, prevTrack };
};
