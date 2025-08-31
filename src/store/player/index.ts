import { StateCreatorFull } from '../types';
import actions from './actions';
import { PlayerSlice, PlayerState } from './types';

const initial: PlayerState = {
  requestPodcastId: 0,
  playlistEpisodeIds: [],
  currentIndex: -1,
  volume: 50,
  currentTime: 0,
  playState: 'STOPPED',
  repeat: 'NO',
  shuffle: false,
};

export const createPlayerSlice: StateCreatorFull<PlayerSlice> = set => ({
  ...initial,
  ...actions(set),
});
