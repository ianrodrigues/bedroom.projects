import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const state = useStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/' && !state.ui.showName) {
      state.ui.setShowName(true);
    }
  }, [location.pathname]);


  const containerVisible =
    state.ui.isAnyMenuOpen() ||
    (!location.pathname.includes('info') && !location.pathname.includes('grid'));

  return (
    <MediaTitleOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={state.ui.isFullscreen && state.ui.isMenuOpen.L} side="L">
        {state.media.photo?.title}
      </MediaTitle>
      <MediaTitle visible={state.ui.isFullscreen && state.ui.isMenuOpen.R} side="R">
        {state.media.video?.title}
      </MediaTitle>
    </MediaTitleOverlayContainer>
  );
};

export default MediaTitleOverlay;
