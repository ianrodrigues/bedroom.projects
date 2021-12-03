import React from 'react';
import shallow from 'zustand/shallow';

import useStore, { selectors } from 'state';
import { useMultiMatchRoute } from 'hooks';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const { isFullscreen: isCanvasFullscreen, isMenuOpen, isAnyMenuOpen } = useStore(selectors.ui, shallow);
  const { photo, video } = useStore(selectors.media, shallow);
  const { multiMatchRoute } = useMultiMatchRoute();

  const containerVisible = isAnyMenuOpen() || !multiMatchRoute(['info', 'grid']);

  return (
    <MediaTitleOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={isCanvasFullscreen && isMenuOpen.L} side="L">
        {photo?.title}
      </MediaTitle>
      <MediaTitle visible={isCanvasFullscreen && isMenuOpen.R} side="R">
        {video?.title}
      </MediaTitle>
    </MediaTitleOverlayContainer>
  );
};

export default MediaTitleOverlay;
