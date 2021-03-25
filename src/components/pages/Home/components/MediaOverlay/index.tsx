import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaOverlayContainer } from './styled';


const MediaOverlay: React.VFC = () => {
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
    <MediaOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={state.isFullscreen && state.isMenuOpen.L} side="L">
        {state.photo?.title}
      </MediaTitle>
      <MediaTitle visible={state.isFullscreen && state.isMenuOpen.R} side="R">
        {state.video?.title}
      </MediaTitle>
    </MediaOverlayContainer>
  );
};

export default MediaOverlay;
