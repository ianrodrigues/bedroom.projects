import * as i from 'types';


export interface State {
  loading: i.GlobalLoadingState;
  showName: boolean;
  isFullscreen: boolean;
  isMenuOpen: Record<i.Side, boolean>;
}

export interface Actions {
  setLoading: (loading: i.GlobalLoadingState) => void;
  setShowName: (showName: boolean) => void;
  setFullscreen: (isFullscreen: boolean) => void;
  setMenuOpen: (side: i.Side, open: boolean) => void;
  closeMenus: () => void;
  isAnyMenuOpen: () => boolean;
}

export interface UiState extends State, Actions {}
