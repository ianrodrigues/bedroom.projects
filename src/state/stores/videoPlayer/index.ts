import * as i from 'types';

import { State, Actions } from './types';


const state: State = {
  isPlaying: false,
  isReady: false,
};

const actions: i.ActionsCreator<Actions> = (set) => ({
  setPlaying: (isPlaying) => set((state) => {
    state.videoPlayer.isPlaying = isPlaying;
  }),
  setReady: (isReady) => set((state) => {
    state.videoPlayer.isReady = isReady;
  }),
});

export default {
  state,
  actions,
};
