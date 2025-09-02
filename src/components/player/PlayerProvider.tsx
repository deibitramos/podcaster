import React, { useMemo } from 'react';
import { useAppStore } from '@/store';
import usePodcastEpisode from './hooks/usePodcastEpisode';
import { Spinner } from '../ui/spinner';
import { ErrorComponent } from '../ui/error';
import AudioController from './AudioController';
import { mapTrack } from '@/entities/currentTrack';
import TrackContext from './TrackContext';

type Props = { children: React.ReactNode };
function PlayerProvider({ children }: Props) {
  const requestPodcastId = useAppStore(state => state.requestPodcastId);
  const requestEpisodeId = useAppStore(state => state.requestEpisodeId);

  const data = usePodcastEpisode(requestPodcastId, requestEpisodeId);
  const { isFetching, error } = data;

  const track = data.episode ? mapTrack(requestPodcastId, data.episode) : null;

  // Memoize the context value to prevent unnecessary re-renders
  const trackValue = useMemo(() => track, [track]);

  if (isFetching) return <Spinner size="lg" />;
  if (error) return (
    <ErrorComponent title="Failed to load episode" error={error} variant="minimal" />
  );
  if (!data.episode || !trackValue) return null;

  return (
    <TrackContext value={trackValue}>
      <AudioController>{children}</AudioController>
    </TrackContext>
  );
}

export default PlayerProvider;
