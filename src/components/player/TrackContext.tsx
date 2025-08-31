import { createContext } from 'react';
import { CurrentTrack } from '@/entities/currentTrack';

// Create the Track Context
type TrackContextType = CurrentTrack | null;

const TrackContext = createContext<TrackContextType>(null);

export type { TrackContextType };
export default TrackContext;
