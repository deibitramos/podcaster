import { createContext } from 'react';
import { CurrentTrack } from '@/entities/currentTrack';

const TrackContext = createContext<CurrentTrack | null>(null);

export default TrackContext;
