import * as i from 'types';


export interface State {
  allMedia?: i.AllMedia;
  photo?: i.StatePhotoObject;
  video?: i.StateVideoObject;
}

interface MediaForType {
  photo: i.StatePhotoObject;
  video: i.StateVideoObject;
}

export interface Actions {
  setAllMedia: (media: i.AllMedia) => void;
  setMedia: <T extends i.MediaType>(type: T, media: MediaForType[T]) => void;
}

export interface MediaState extends State, Actions {}
