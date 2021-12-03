import * as i from 'types';


export interface State {
  loading: i.GlobalLoadingState;
  showName: boolean;
  isFullscreen: boolean;
  isMenuOpen: Record<i.Side, boolean>;
}
