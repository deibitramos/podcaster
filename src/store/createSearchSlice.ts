import { StateCreatorFull } from './types';

export type SearchSlice = {
  filter: string;
  setFilter: (value: string) => void;
};

const createSearchSlice: StateCreatorFull<SearchSlice> = set => ({
  filter: '',
  setFilter: (value: string) => { set({ filter: value }, undefined, 'setFilter'); },
});

export default createSearchSlice;
