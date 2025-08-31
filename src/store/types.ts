import { StateCreator } from 'zustand';
import { PlayerSlice } from './player/types';
import { SearchSlice } from './createSearchSlice';

// Generic Types

export type StateCreatorFull<T> = StateCreator<T, [['zustand/devtools', never]]>;

export type SetState<T> = Parameters<StateCreatorFull<T>>[0];
export type GetState<T> = Parameters<StateCreatorFull<T>>[1];

export type StoreState = PlayerSlice & SearchSlice;
export type IDType = { id: string | number };
