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


  let text: string | undefined = undefined;

  if (state.isMenuOpen.L) {
    text = state.photo?.title;
  } else if (state.isMenuOpen.R) {
    text = state.video?.title;
  }

  const containerVisible = state.isAnyMenuOpen() || !location.pathname.includes('info');

  return (
    <MediaOverlayContainer $visible={containerVisible}>
      <MediaTitle visible={state.isAnyMenuOpen()} side={state.isMenuOpen.L ? 'L' : 'R'}>
        {text}
      </MediaTitle>
    </MediaOverlayContainer>
  );
};

export default MediaOverlay;
