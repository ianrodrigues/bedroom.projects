export type State = {
  isPlaying: boolean;
  isReady: boolean;
}

export type Actions = {
  setPlaying: (isPlaying: boolean) => void;
  setReady: (isReady: boolean) => void;
}

export interface VideoPlayerState extends State, Actions {}
