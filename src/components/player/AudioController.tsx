import { PropsWithChildren, useEffect } from 'react';
import { useAppStore } from '@/store';
import audio, { AudioControl } from '@/store/player/AudioControl';
import { useTrack } from './hooks/useTrack';
import { showToast } from '@/lib/toast';

function getAudioErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case 1: return 'Media loading aborted';
    case 2: return 'Network error while loading media';
    case 3: return 'Media decoding failed';
    case 4: return 'Media format not supported';
    default: return 'Unknown audio error';
  }
}

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
      const audioElement = event.target as AudioControl;
      const error = audioElement.error;

      if (error) {
        const errorMessage = getAudioErrorMessage(error.code);
        console.error('Audio playback error:', error);
        showToast.error(`Audio Error: ${errorMessage}`);
      }
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
