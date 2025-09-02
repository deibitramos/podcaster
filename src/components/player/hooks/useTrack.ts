import { use } from 'react';
import TrackContext from '../TrackContext';
import { assertExists } from '@/lib/errors';

export const useTrack = () => {
  const track = use(TrackContext);
  assertExists(track, 'track');
  return track;
};
