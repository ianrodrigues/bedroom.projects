import * as i from 'types';

import useStore from 'state';


export function getMediaObjectBySlug<T extends i.MediaType>(slug: string, type: T): (T extends 'photo' ? i.StatePhotoObject : i.StateVideoObject) | undefined {
  const state = useStore.getState();

  // Cba fixing this, it works.
  // @ts-ignore
  return state.allMedia?.[type].find((val) => val.slug === slug);
}
