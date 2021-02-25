import create from 'zustand';

import Aw2Cover from 'images/aw2-cover.jpg';

type State = {
  photo: Media;
  video: Media;
  setMedia: (media: 'photo' | 'video', title: string, src: string) => void;
}

type Media = {
  title: string;
  src: string;
}

const useStore = create<State>((set) => ({
  photo: {
    title: 'AW 20/21 drop 2',
    src: Aw2Cover,
  },
  video: {
    title: 'Beabadoobee - Worth It',
    src: 'https://bedroom.sandervispoel.com/static/beabadoobee__worth_it.mov',
  },
  setMedia: (media, title, src) => set(() => ({
    [media]: { title, src },
  })),
}));

export default useStore;
