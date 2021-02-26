import create, { State } from 'zustand';

import mediaDb from 'services/mediaDB';
import { MouseSide } from 'pages/Home/components/Canvas';

interface AppState extends State {
  photo: MediaData;
  video: MediaData;
  setMedia: (type: MediaType, media: MediaData) => void;

  showName: boolean;
  setShowName: (showName: boolean) => void;

  sideFullscreen: MouseSide;
  setSideFullscreen: (side: MouseSide) => void;
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

  sideFullscreen: null,
  setSideFullscreen: (side) => set(() => ({
    sideFullscreen: side,
  })),
}));

export default useStore;
