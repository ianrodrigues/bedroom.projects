import * as i from 'types';

import useStore from 'state';


type MediaReturnType<T extends i.MediaType> = (T extends 'photo' ? i.StatePhotoObject : i.StateVideoObject);

export function getMediaObjectBySlug<T extends i.MediaType>(slug: string, type: T): MediaReturnType<T> | undefined {
  const state = useStore.getState();
  const mediaArr = state.media.allMedia?.[type] as MediaReturnType<T>[] | undefined;

  return mediaArr?.find((val) => val.slug === slug);
}
