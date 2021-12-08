import * as i from 'types';
import create from 'zustand';

import { immer } from './middleware';

import * as slices from './slices';


// Without immer this needs to be replaced with `i.StateCreator`
const createState: i.StateCreatorImmer = (set, get) => {
  const state = {} as i.AppState;

  let sliceKey: keyof typeof slices;
  for (sliceKey in slices) {
    state[sliceKey] = {
      ...(slices as i.StringKeyObject)[sliceKey].state,
      ...(slices as i.StringKeyObject)[sliceKey].actions(set, get),
    };
  }

  return state;
};

// Store with immer & localStorage persistence
// const useStore = create<i.AppState>(persist(immer(createState)));

// Store without persistence
const useStore = create<i.AppState>(immer(createState));

// Store without middleware
// const useStore = create<i.AppState>(createState);

export * as selectors from './selectors';
export default useStore;


// Generate State record type with the name of state slices and by intersecting slice state & actions
export type AppState = {
  [k in keyof typeof slices]: i.IntersectStoreSlice<typeof slices[k]>;
}
