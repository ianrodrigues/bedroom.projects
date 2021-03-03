import * as i from 'types';
import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import useStore from 'state';

import { Name, PhotoFilmPreviewContainer, TitleContainer, TitleInner, MediaTitle } from './styled';


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
    <PhotoFilmPreviewContainer>
      <Name show={state.showName}>bedroom</Name>
      <TitleContainer>
        <TitleInner>
          <MediaTitle
            show={state.isFullscreen}
            side={props.sizeData.L ? 'L' : 'R'}
          >
            {props.sizeData.L ? state.photo?.title : state.video?.title}
          </MediaTitle>
        </TitleInner>
      </TitleContainer>
    </PhotoFilmPreviewContainer>
  );
};

interface Props {
  sizeData: i.SizeData;
}

export default MediaOverlay;
