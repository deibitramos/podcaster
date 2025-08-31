import { PropsWithChildren, useEffect } from 'react';
import { useAppStore } from '@/store';
import audio, { AudioControl } from '@/store/player/AudioControl';
import { useTrack } from './hooks/useTrack';

function AudioController({ children }: PropsWithChildren) {
  const track = useTrack();
  const playState = useAppStore(state => state.playState);
  const volume = useAppStore(state => state.volume);
  const stop = useAppStore(state => state.stop);
  const setTime = useAppStore(state => state.setCurrentTime);
  const nextTrack = useAppStore(state => state.nextTrack);

  useEffect(() => {
    const timeUpdate = () => {
      setTime(audio.currentTime);
    };

    const errorHandler = (event: Event) => {
      console.error('Audio error:', (event.target as AudioControl).error);
      stop();
    };

    const endedHandler = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', timeUpdate);
    audio.addEventListener('error', errorHandler);
    audio.addEventListener('ended', endedHandler);
    audio.setVolume(volume);
    return () => {
      audio.removeEventListener('timeupdate', timeUpdate);
      audio.removeEventListener('error', errorHandler);
      audio.removeEventListener('ended', endedHandler);
    };
  }, []);

  useEffect(() => {
    if (playState === 'PLAYING') {
      audio.playTrack(track.url);
    } else {
      audio.stopTrack(playState === 'PAUSED');
    }
  }, [track.url, playState]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  return children;
}

export default AudioController;
