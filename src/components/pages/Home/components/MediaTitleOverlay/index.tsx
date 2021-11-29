import React from 'react';

import useStore from 'state';
import { useMultiMatchRoute } from 'hooks';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const state = useStore();
  const { multiMatchRoute } = useMultiMatchRoute();

  const containerVisible = state.ui.isAnyMenuOpen() || !multiMatchRoute(['info', 'grid']);

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
