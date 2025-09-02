import { PlayerActions, PlayerSlice } from './types';
import { changeTrack, getNextRepeat } from './utils';
import { SetState } from '../types';
import { qc } from '@/qc';
import { findEpisodeInCache, PodcastWithEpisodes } from '@/api/episodes';
import { assertExists } from '@/lib/errors';

const actions = (set: SetState<PlayerSlice>): PlayerActions => {
  return {
    playPodcastEpisode: (podcastId: number, episodeId: number) => {
      const result = qc.getQueryData<PodcastWithEpisodes>(['episodes', podcastId]);
      assertExists(result, 'result');

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
        playState: current ? 'PLAYING' : 'STOPPED',
        ...(current
          ? { currentIndex: 0, playlistEpisodeIds: [current.episodes[0].id] }
          : {}),
      });
    },
    retryPlayLastEpisode: (episodeId: number) => {
      set({ currentIndex: 0, playlistEpisodeIds: [episodeId], playState: 'PLAYING' });
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
