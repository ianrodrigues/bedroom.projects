import * as i from 'types';

import { isStatePhotoObject, isStateVideoObject } from 'services/typeguards';

import { State, MediaForType } from './types';


const state: State = {};

const actions = (set: i.Set) => ({
  setAllMedia: (media: i.AllMedia) => set((state) => {
    state.media.allMedia = media;
  }),
  setMedia: <T extends i.MediaType>(type: T, media: MediaForType[T]) => set((state) => {
    if (type === 'photo' && isStatePhotoObject(media)) {
      state.media.photo = media;
    }

    if (type === 'video' && isStateVideoObject(media)) {
      state.media.video = media;
    }
  }),
});

const slice: i.StoreSlice<State, typeof actions> = {
  state,
  actions,
};

export default slice;
