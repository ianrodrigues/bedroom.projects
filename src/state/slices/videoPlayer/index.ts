import * as i from 'types';

import { State } from './types';


const state: State = {
  isPlaying: false,
  isReady: false,
};

const actions = (set: i.Set) => ({
  setPlaying: (isPlaying: boolean) => set((state) => {
    state.videoPlayer.isPlaying = isPlaying;
  }),
  setReady: (isReady: boolean) => set((state) => {
    state.videoPlayer.isReady = isReady;
  }),
});

const slice: i.StoreSlice<State, typeof actions> = {
  state,
  actions,
};

export default slice;
