import React from 'react';
import { useLocation } from 'react-location';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const state = useStore();
  const location = useLocation();

  React.useEffect(() => {
    if (location.current.pathname === '/' && !state.ui.showName) {
      state.ui.setShowName(true);
    }
  }, [location.current.pathname]);

  const containerVisible =
    state.ui.isAnyMenuOpen() || ['/info', '/grid'].every((p) => p !== location.current.pathname);

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
