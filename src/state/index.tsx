import mediaDb from 'services/mediaDB';
import create, { State } from 'zustand';

interface AppState extends State {
  photo: MediaData;
  video: MediaData;
  setMedia: (type: MediaType, media: MediaData) => void;
}

export type MediaData = {
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
}));

export default useStore;
