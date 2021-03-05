import * as i from 'types';
import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import { Route, Switch } from 'react-router';

import useStore from 'state';
import MediaTitle from 'common/typography/MediaTitle';

import { Name, MediaOverlayContainer } from './styled';


const MediaOverlay: React.VFC<Props> = (props) => {
  const state = useStore();

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
      <MediaTitle visible={state.isFullscreen} side={props.sizeData.L ? 'L' : 'R'}>
        {props.sizeData.L ? state.photo?.title : state.video?.title}
      </MediaTitle>
    </MediaOverlayContainer>
  );
};

interface Props {
  sizeData: i.SizeData;
}

export default MediaOverlay;
