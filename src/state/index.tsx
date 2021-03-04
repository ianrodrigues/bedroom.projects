import * as i from 'types';
import create from 'zustand';

import { log } from 'services';

import { fetchMedia } from './utils';


const useStore = create<i.AppState>(log((set) => ({
  allMedia: undefined,
  setAllMedia: (media) => set(() => ({
    allMedia: media,
  })),

  photo: undefined,
  video: undefined,
  setMedia: (type, media) => set(() => ({
    [type]: media,
  })),

  templates: {},
  setTemplates: (templates) => set(() => ({
    templates,
  })),

  showName: true,
  setShowName: (showName) => set(() => ({
    showName,
  })),

  isFullscreen: false,
  setFullscreen: (bool) => set(() => ({
    isFullscreen: bool,
  })),

  isMenuOpen: {
    L: false,
    R: false,
  },
  setMenuOpen: (side, open) => set((state) => ({
    isMenuOpen: {
      ...state.isMenuOpen,
      [side]: open,
    },
  })),
  closeMenus: () => set(() => ({
    isMenuOpen: {
      L: false,
      R: false,
    },
  })),
})));

fetchMedia();

export default useStore;
