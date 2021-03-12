import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import { Route, Switch, useLocation } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { Name, MediaOverlayContainer } from './styled';


const MediaOverlay: React.VFC = () => {
  const state = useStore();
  const location = useLocation();
  let text: string | undefined = undefined;

  if (state.isMenuOpen.L) {
    text = state.photo?.title;
  } else if (state.isMenuOpen.R) {
    text = state.video?.title;
  }

  React.useEffect(() => {
    const body = document.querySelector('body');

    if (!body) {
      return;
    }

    disableBodyScroll(body);

    return function cleanup() {
      enableBodyScroll(body);
    };
  }, []);

  React.useEffect(() => {
    if (location.pathname === '/' && !state.showName) {
      state.setShowName(true);
    }
  }, [location.pathname]);

  return (
    <MediaOverlayContainer>
      <Switch>
        <Route
          path="/"
          exact
          render={() => <Name show={state.showName}>bedroom</Name>}
        />
      </Switch>
      <MediaTitle visible={state.isFullscreen} side={state.isMenuOpen.L ? 'L' : 'R'}>
        {text}
      </MediaTitle>
    </MediaOverlayContainer>
  );
};

export default MediaOverlay;
