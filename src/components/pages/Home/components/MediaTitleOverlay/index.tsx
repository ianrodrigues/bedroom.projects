import React from 'react';

import { useMultiMatchRoute, useShallowStore } from 'hooks';
import MediaTitle from 'common/typography/MediaTitle';

import { MediaTitleOverlayContainer } from './styled';


const MediaTitleOverlay: React.VFC = () => {
  const ui = useShallowStore('ui', ['isFullscreen', 'isMenuOpen', 'isAnyMenuOpen']);
  const media = useShallowStore('media', ['photo', 'video']);
  const { multiMatchRoute } = useMultiMatchRoute();

  const containerVisible = ui.isAnyMenuOpen() || !multiMatchRoute(['info', 'grid']);

  return (
    <MediaTitleOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={ui.isFullscreen && ui.isMenuOpen.L} side="L">
        {media.photo?.title}
      </MediaTitle>
      <MediaTitle visible={ui.isFullscreen && ui.isMenuOpen.R} side="R">
        {media.video?.title}
      </MediaTitle>
    </MediaTitleOverlayContainer>
  );
};

export default MediaTitleOverlay;
