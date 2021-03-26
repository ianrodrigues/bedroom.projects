import * as i from 'types';

export function isVideo(media?: i.PhotoMedia | i.VideoMedia): media is i.VideoMedia {
  return !!media && media.formats === null;
}

export function isPhoto(media?: i.PhotoMedia | i.VideoMedia): media is i.PhotoMedia {
  return !!media && media.formats != null;
}

export function isPhotoList(list?: i.PhotoMedia[] | i.VideoMedia[]): list is i.PhotoMedia[] {
  return !!list && !!list[0] && list[0].formats != null;
}

export function isAPIPhotoObject(object?: i.APIMediaObject | i.APIPhotosObject): object is i.APIPhotosObject {
  return !!object && (object.full_video == null && object.video_url == null);
}

export function isStatePhotoObject(object?: i.StatePhotoObject | i.StateVideoObject): object is i.StatePhotoObject {
  return !!object && object.full_video == null && 'next' in object;
}

export function isStatePhotoObjectList(list?: i.StatePhotoObject[] | i.StateVideoObject[]): list is i.StatePhotoObject[] {
  return !!list && !!list[0] && list[0].full_video == null && 'next' in list[0];
}

export function isStateVideoObject(object?: i.StatePhotoObject | i.StateVideoObject): object is i.StateVideoObject {
  return !!object && (object.full_video != null || object.video_url != null) && 'next' in object;
}
