import * as i from 'types';
import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import { Route, Switch } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { Name, MediaOverlayContainer } from './styled';


const MediaOverlay: React.VFC = () => {
  const state = useStore();
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

  return (
    <MediaOverlayContainer>
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <Name {...props} show={state.showName}>bedroom</Name>}
        />
      </Switch>
      <MediaTitle visible={state.isFullscreen} side={state.isMenuOpen.L ? 'L' : 'R'}>
        {text}
      </MediaTitle>
    </MediaOverlayContainer>
  );
};

export default MediaOverlay;
