import * as i from 'types';


export function ui(s: i.AppState): i.AppState['ui'] {
  return s.ui;
}

export function media(s: i.AppState): i.AppState['media'] {
  return s.media;
}

export function videoPlayer(s: i.AppState): i.AppState['videoPlayer'] {
  return s.videoPlayer;
}
