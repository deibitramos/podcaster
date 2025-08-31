import { PlayerActions, PlayerSlice } from './types';
import { changeTrack, getNextRepeat } from './utils';
import { SetState } from '../types';
import { qc } from '@/qc';
import { findCurrentInCache, PodcastWithEpisodes } from '@/api/episodes';

const actions = (set: SetState<PlayerSlice>): PlayerActions => {
  return {
    playPodcastEpisode: (podcastId: number, episodeId: number) => {
      const result = qc.getQueryData<PodcastWithEpisodes>(['episodes', podcastId]);
      if (!result) return;

      const episodeIds = result.episodes.map(e => e.id);
      const startIndex = episodeIds.indexOf(episodeId);

      set({
        requestPodcastId: podcastId,
        playlistEpisodeIds: episodeIds,
        currentIndex: startIndex,
        playState: 'PLAYING',
      }, undefined, 'playPodcastEpisode');
    },
    tryPlayLastEpisode: (podcastId: number) => {
      const current = findCurrentInCache(qc, podcastId);

      set({
        requestPodcastId: podcastId,
        currentIndex: 0,
        playState: current ? 'PLAYING' : 'STOPPED',
        ...(current ? { playlistEpisodeIds: [current.episodes[0].id] } : {}),
      }, undefined, 'tryPlayLastEpisode');
    },
    retryPlayLastEpisode: (episodeId: number) => {
      set({
        playlistEpisodeIds: [episodeId],
        playState: 'PLAYING',
      }, undefined, 'retryPlayLastEpisode');
    },
    play: () => {
      set({ playState: 'PLAYING' }, undefined, 'play');
    },
    pause: () => {
      set({ playState: 'PAUSED' }, undefined, 'pause');
    },
    stop: () => {
      set({ playState: 'STOPPED' }, undefined, 'stop');
    },
    nextTrack: () => {
      set(state => changeTrack(state, true), undefined, 'nextTrack');
    },
    prevTrack: () => {
      set(state => changeTrack(state, false), undefined, 'prevTrack');
    },
    setCurrentTime: (time: number) => { set({ currentTime: time }); },
    setRepeat: () => {
      set(state => ({ repeat: getNextRepeat(state.repeat) }), undefined, 'setRepeat');
    },
    setShuffle: () => { set(state => ({ shuffle: !state.shuffle }), undefined, 'setShuffle'); },
    setVolume: (volume: number) => {
      set({ volume }, undefined, 'setVolume');
    },
  };
};

export default actions;

// if (getLastPodcastEpisode.matchFulfilled(action)) {
//   audioPlay(false);
// }
