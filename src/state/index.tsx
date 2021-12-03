import * as i from 'types';
import create from 'zustand';

import { immer } from './middleware';

import * as slices from './slices';


const useStore = create<i.AppState>(immer((set, get) => {
  const state = {} as i.AppState;

  let sliceKey: keyof typeof slices;
  for (sliceKey in slices) {
    state[sliceKey] = {
      ...(slices as i.StringKeyObject)[sliceKey].state,
      ...(slices as i.StringKeyObject)[sliceKey].actions(set, get),
    };
  }

  return state;
}));

export type AppState = {
  [k in keyof typeof slices]: i.IntersectStoreSlice<typeof slices[k]>;
}

export default useStore;
