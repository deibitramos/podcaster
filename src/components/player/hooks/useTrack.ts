import { use } from 'react';
import TrackContext from '../TrackContext';

export const useTrack = () => {
  const track = use(TrackContext);
  if (!track) {
    throw new Error('useTrack must be used within a PlayerProvider');
  }
  return track;
};
