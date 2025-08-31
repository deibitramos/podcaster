import { PlayerState, Repeat } from './types';

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

export const stopPlaying = () => ({
  playlistEpisodeIds: [],
  playState: 'STOPPED',
  currentIndex: -1,
});

export const changeTrack = (state: PlayerState, goingNext: boolean) => {
  const newState = { currentTime: 0 };

  const { length } = state.playlistEpisodeIds;
  if (length === 0) return { ...newState, ...stopPlaying() };

  if (state.repeat === 'ONE') return newState;

  if (state.shuffle) {
    return {
      ...newState,
      currentIndex: random(length, state.currentIndex),
    };
  }

  const first = state.currentIndex === 0;
  const last = state.currentIndex === length - 1;
  if (state.repeat === 'NO' && ((goingNext && last) || (!goingNext && first))) {
    return { ...newState, ...stopPlaying() };
  }

  if (state.repeat === 'ALL') {
    if (goingNext && last) return { ...newState, currentIndex: 0 };
    if (!goingNext && first) return { ...newState, currentIndex: length - 1 };
  }

  // all border cases covered, act as expected here
  return { ...newState, currentIndex: goingNext ? state.currentIndex + 1 : state.currentIndex - 1 };
};
