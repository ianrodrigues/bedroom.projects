import * as i from 'types';


export type State = {
  allMedia?: i.AllMedia;
  photo?: i.StatePhotoObject;
  video?: i.StateVideoObject;
}

type MediaForType = {
  photo: i.StatePhotoObject;
  video: i.StateVideoObject;
}

export type Actions = {
  setAllMedia: (media: i.AllMedia) => void;
  setMedia: <T extends i.MediaType>(type: T, media: MediaForType[T]) => void;
}

export interface MediaState extends State, Actions {}
