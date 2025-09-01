import { PlayerActions, PlayerSlice } from './types';
import { changeTrack, getNextRepeat } from './utils';
import { SetState } from '../types';
import { qc } from '@/qc';
import { findEpisodeInCache, PodcastWithEpisodes } from '@/api/episodes';

const actions = (set: SetState<PlayerSlice>): PlayerActions => {
  return {
    playPodcastEpisode: (podcastId: number, episodeId: number) => {
      const result = qc.getQueryData<PodcastWithEpisodes>(['episodes', podcastId]);
      if (!result) {
        throw new Error('Episodes not found in cache');
      }

      const episodeIds = result.episodes.map(e => e.id);
      const startIndex = episodeIds.indexOf(episodeId);

      set({
        requestPodcastId: podcastId,
        requestEpisodeId: episodeId,
        playlistEpisodeIds: episodeIds,
        currentIndex: startIndex,
        playState: 'PLAYING',
      });
    },
    tryPlayLastEpisode: (podcastId: number) => {
      const current = findEpisodeInCache(qc, podcastId);

      set({
        requestPodcastId: podcastId,
        requestEpisodeId: undefined,
        currentIndex: 0,
        playState: current ? 'PLAYING' : 'STOPPED',
        ...(current ? { playlistEpisodeIds: [current.episodes[0].id] } : {}),
      });
    },
    retryPlayLastEpisode: (episodeId: number) => {
      set({ playlistEpisodeIds: [episodeId], playState: 'PLAYING' });
    },
    play: () => { set({ playState: 'PLAYING' }); },
    pause: () => { set({ playState: 'PAUSED' }); },
    stop: () => { set({ playState: 'STOPPED' }); },
    nextTrack: () => { set(state => changeTrack(state, true)); },
    prevTrack: () => { set(state => changeTrack(state, false)); },
    setCurrentTime: (time: number) => { set({ currentTime: time }, false); },
    setRepeat: () => { set(state => ({ repeat: getNextRepeat(state.repeat) })); },
    setShuffle: () => { set(state => ({ shuffle: !state.shuffle })); },
    setVolume: (volume: number) => { set({ volume }, undefined, 'setVolume'); },
  };
};

export default actions;

// if (getLastPodcastEpisode.matchFulfilled(action)) {
//   audioPlay(false);
// }
