import * as i from 'types';

import { State, Actions } from './types';


const state: State = {
  loading: 'site',
  showName: false,
  isFullscreen: false,
  isMenuOpen: {
    L: false,
    R: false,
  },
};

const actions: i.ActionsCreator<Actions> = (set, get) => ({
  setLoading: (loading) => set((state) => {
    state.ui.loading = loading;
  }),
  setShowName: (showName) => set((state) => {
    state.ui.showName = showName;
  }),
  setFullscreen: (isFullscreen) => set((state) => {
    state.ui.isFullscreen = isFullscreen;
  }),
  setMenuOpen: (side, open) => set((state) => {
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

const store = {
  state,
  actions,
};

export default store;
