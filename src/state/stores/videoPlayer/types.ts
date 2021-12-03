export interface State {
  isPlaying: boolean;
  isReady: boolean;
}

export interface Actions {
  setPlaying: (isPlaying: boolean) => void;
  setReady: (isReady: boolean) => void;
}

export interface VideoPlayerState extends State, Actions {}
