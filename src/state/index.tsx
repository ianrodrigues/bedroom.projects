import create, { State } from 'zustand';

import mediaDb from 'services/mediaDB';

interface AppState extends State {
  photo: MediaData;
  video: MediaData;
  setMedia: (type: MediaType, media: MediaData) => void;

  showName: boolean;
  setShowName: (showName: boolean) => void;

  isFullscreen: boolean;
  setSideFullscreen: (bool: boolean) => void;
}

export interface MediaData {
  id: number;
  title: string;
  src: string;
}

export type MediaType = 'photo' | 'video';


const useStore = create<AppState>((set) => ({
  photo: mediaDb.photos[0],
  video: mediaDb.videos[0],
  setMedia: (type, media) => set(() => ({
    [type]: media,
  })),

  showName: true,
  setShowName: (showName) => set(() => ({
    showName,
  })),

  isFullscreen: false,
  setSideFullscreen: (bool) => set(() => ({
    isFullscreen: bool,
  })),
}));

export default useStore;
