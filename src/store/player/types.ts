export type Repeat = 'NO' | 'ALL' | 'ONE';

export type PlayState = 'PLAYING' | 'PAUSED' | 'STOPPED';

export type PlayerState = {
  requestPodcastId: number;
  playlistEpisodeIds: number[];
  currentIndex: number;
  volume: number;
  currentTime: number;
  playState: PlayState;
  repeat: Repeat;
  shuffle: boolean;
};

export type PlayerActions = {
  playPodcastEpisode: (podcastId: number, episodeId: number) => void;
  tryPlayLastEpisode: (podcastId: number) => void;
  retryPlayLastEpisode: (episodeId: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentTime: (time: number) => void;
  setRepeat: () => void;
  setShuffle: () => void;
  setVolume: (volume: number) => void;
};

export type PlayerSlice = PlayerState & PlayerActions;
