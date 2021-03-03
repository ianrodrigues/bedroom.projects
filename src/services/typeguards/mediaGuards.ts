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

export function isAPIPhotoObject(object: i.APIMediaObject | i.APIPhotosObject): object is i.APIPhotosObject {
  return !!object && object.video_url == null;
}
