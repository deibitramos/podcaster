import { PlayerState, PlayState, Repeat } from './types';

const repeatOrder: Repeat[] = ['NO', 'ALL', 'ONE'];

export const getNextRepeat = (current: Repeat) => {
  const index = repeatOrder.findIndex(x => x === current);
  return index === 2 ? repeatOrder[0] : repeatOrder[index + 1];
};

const random = (maxLimit: number, previous: number) => {
  let rand = Math.floor(Math.random() * maxLimit);
  if (rand === previous) {
    // avoid repeating same track
    rand = random(maxLimit, previous);
  }
  return rand;
};

export const changeTrack = (state: PlayerState, goingNext: boolean) => {
  const upcoming = calculateUpcomingTrack(state, goingNext);

  if (upcoming.currentIndex === -1) return {
    ...upcoming,
    playlistEpisodeIds: [],
    playState: 'STOPPED' as PlayState,
    requestPodcastId: 0,
    requestEpisodeId: undefined,
  };

  return {
    ...upcoming,
    requestEpisodeId: state.playlistEpisodeIds[upcoming.currentIndex],
  };
};

const stateValues = (index: number) => ({ currentTime: 0, currentIndex: index });

const calculateUpcomingTrack = (state: PlayerState, goingNext: boolean) => {
  const { length } = state.playlistEpisodeIds;
  if (length === 0) return stateValues(-1);
  if (state.repeat === 'ONE') return stateValues(state.currentIndex);

  if (state.shuffle) {
    return stateValues(random(length, state.currentIndex));
  }

  const first = state.currentIndex === 0;
  const last = state.currentIndex === length - 1;
  if (state.repeat === 'NO' && ((goingNext && last) || (!goingNext && first))) {
    return stateValues(-1);
  }

  if (state.repeat === 'ALL') {
    if (goingNext && last) return stateValues(0);
    if (!goingNext && first) return stateValues(length - 1);
  }

  // all border cases covered, act as expected here
  return stateValues(goingNext ? state.currentIndex + 1 : state.currentIndex - 1);
};
