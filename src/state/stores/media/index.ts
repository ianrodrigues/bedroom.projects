import * as i from 'types';

import { isStatePhotoObject, isStateVideoObject } from 'services/typeguards';

import { State, Actions } from './types';


const state: State = {
  allMedia: undefined,
  photo: undefined,
  video: undefined,
};

const actions: i.ActionsCreator<Actions> = (set) => ({
  setAllMedia: (media) => set((state) => {
    state.media.allMedia = media;
  }),
  setMedia: (type, media) => set((state) => {
    if (type === 'photo' && isStatePhotoObject(media)) {
      state.media.photo = media;
    }

    if (type === 'video' && isStateVideoObject(media)) {
      state.media.video = media;
    }
  }),
});

const store = {
  state,
  actions,
};

export default store;
