import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const state = useStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/' && !state.showName) {
      state.setShowName(true);
    }
  }, [location.pathname]);


  const containerVisible =
    state.isAnyMenuOpen() ||
    (!location.pathname.includes('info') && !location.pathname.includes('grid'));

  return (
    <MediaTitleOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={state.isFullscreen && state.isMenuOpen.L} side="L">
        {state.photo?.title}
      </MediaTitle>
      <MediaTitle visible={state.isFullscreen && state.isMenuOpen.R} side="R">
        {state.video?.title}
      </MediaTitle>
    </MediaTitleOverlayContainer>
  );
};

export default MediaTitleOverlay;
