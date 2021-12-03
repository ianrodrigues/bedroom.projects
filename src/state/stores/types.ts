import { MediaState } from './media/types';
import { UiState } from './ui/types';
import { VideoPlayerState } from './videoPlayer/types';


export interface AppState {
  media: MediaState;
  ui: UiState;
  videoPlayer: VideoPlayerState;
}
