import * as i from 'types';

export function isVideo(media?: i.PhotoMedia | i.VideoMedia): media is i.VideoMedia {
  return !!media && media.formats === null;
}

export function isPhoto(media?: i.PhotoMedia | i.VideoMedia): media is i.PhotoMedia {
  return !!media && media.formats != null;
}
