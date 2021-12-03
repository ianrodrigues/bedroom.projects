import * as i from 'types';

import { State } from './types';


const state: State = {
  loading: 'site',
  showName: false,
  isFullscreen: false,
  isMenuOpen: {
    L: false,
    R: false,
  },
};

const actions = (set: i.Set, get: i.Get) => ({
  setLoading: (loading: i.GlobalLoadingState) => set((state) => {
    // Setting the loading state again can cause visual glitching
    if (get().ui.loading === loading) {
      return;
    }

    state.ui.loading = loading;
  }),
  setShowName: (showName: boolean) => set((state) => {
    state.ui.showName = showName;
  }),
  setFullscreen: (isFullscreen: boolean) => set((state) => {
    state.ui.isFullscreen = isFullscreen;
  }),
  setMenuOpen: (side: i.Side, open: boolean) => set((state) => {
    state.ui.isMenuOpen[side] = open;
  }),
  closeMenus: () => set((state) => {
    state.ui.isMenuOpen = {
      L: false,
      R: false,
    };
  }),
  isAnyMenuOpen: () => get().ui.isMenuOpen.L || get().ui.isMenuOpen.R,
});

const slice: i.StoreSlice<State, typeof actions> = {
  state,
  actions,
};

export default slice;
