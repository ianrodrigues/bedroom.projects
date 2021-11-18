import * as i from 'types';
import create from 'zustand';

import { log, immer } from './middleware';

import * as stores from './stores';

const useStore = create<i.AppState>(immer((set, get) => {
  type storeKeys = keyof typeof stores;

  const state = {} as i.AppState;

  let storeKey: storeKeys;
  for (storeKey in stores) {
    state[storeKey] = {
      ...(stores as i.StringKeyObject)[storeKey].state,
      ...(stores as i.StringKeyObject)[storeKey].actions(set, get),
    };
  }

  return state;
}));

export default useStore;
