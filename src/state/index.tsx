import * as i from 'types';
import create from 'zustand';

import { log } from 'services';

import { fetchMedia } from './utils';


const useStore = create<i.AppState>(log((set, get) => ({
  allMedia: undefined,
  setAllMedia: (media) => set(() => ({
    allMedia: media,
  })),

  photo: undefined,
  video: undefined,
  setMedia: (type, media) => set(() => ({
    [type]: media,
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
  isAnyMenuOpen: () => get().isMenuOpen.L || get().isMenuOpen.R,

  videoPlayer: {
    isPlaying: false,
    setPlaying: (isPlaying) => set((state) => ({
      videoPlayer: {
        ...state.videoPlayer,
        isPlaying,
      },
    })),
    isReady: false,
    setReady: (isReady) => set((state) => ({
      videoPlayer: {
        ...state.videoPlayer,
        isReady,
      },
    })),
  },
})));

fetchMedia();

export default useStore;
