import React, { useMemo } from 'react';
import { useAppStore } from '@/store';
import usePodcastEpisode from './hooks/usePodcastEpisode';
import { Spinner } from '../ui/spinner';
import AudioController from './AudioController';
import { mapTrack } from '@/entities/currentTrack';
import TrackContext from './TrackContext';

type Props = { children: React.ReactNode };
function PlayerProvider({ children }: Props) {
  const requestPodcastId = useAppStore(state => state.requestPodcastId);
  const playlistEpisodeIds = useAppStore(state => state.playlistEpisodeIds);
  const currentIndex = useAppStore(state => state.currentIndex);

  const currentEpisodeId = playlistEpisodeIds[currentIndex];
  const data = usePodcastEpisode(requestPodcastId, currentEpisodeId);
  const { isFetching, error } = data;

  const track = data.episode ? mapTrack(requestPodcastId, data.episode) : null;

  // Memoize the context value to prevent unnecessary re-renders
  const trackValue = useMemo(() => track, [track]);

  if (isFetching) return <Spinner />;
  if (error) return <div>Error!</div>;
  if (!data.episode || !trackValue) return null;

  return (
    <TrackContext value={trackValue}>
      <AudioController>{children}</AudioController>
    </TrackContext>
  );
}

export default PlayerProvider;
