import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { StoreState } from './types';
import { createPlayerSlice } from './player';
import createSearchSlice from './createSearchSlice';

export const useAppStore = create<StoreState>()(
  devtools((set, get, api) => {
    const store = {
      ...createPlayerSlice(set, get, api),
      ...createSearchSlice(set, get, api),
    };
    return store;
  }),
);

export function useShallowAppStore<T>(selector: (state: StoreState) => T): T {
  return useAppStore(useShallow(selector));
};
