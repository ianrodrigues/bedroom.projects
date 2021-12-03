import * as i from 'types';


export interface State {
  allMedia?: i.AllMedia;
  photo?: i.StatePhotoObject;
  video?: i.StateVideoObject;
}

export interface MediaForType {
  photo: i.StatePhotoObject;
  video: i.StateVideoObject;
}
