import { Episode } from '.';

export type CurrentTrack = {
  episodeId: number;
  podcastId: number;
  duration: number;
  url: string;
};

export const mapTrack = (podcastId: number, episode: Episode | undefined): CurrentTrack => ({
  episodeId: episode?.id ?? 0,
  podcastId,
  duration: episode?.duration ?? 0,
  url: episode?.url ?? '',
});
