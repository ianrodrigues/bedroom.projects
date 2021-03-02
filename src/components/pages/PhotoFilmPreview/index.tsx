import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import useStore from 'state';

import RenderCanvas from 'common/presentation/RenderCanvas';
import { Name, PhotoFilmPreviewContainer, TitleContainer, TitleInner, MediaTitle } from './styled';


const PhotoFilmPreview: React.VFC = () => {
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
      <RenderCanvas>
        {((props) => (
          <TitleContainer>
            <TitleInner>
              <MediaTitle show={state.isFullscreen && props.sizeData.L === 'full'}>
                {state.photo?.title}
              </MediaTitle>
              <MediaTitle show={state.isFullscreen && props.sizeData.R === 'full'}>
                {state.video?.title}
              </MediaTitle>
            </TitleInner>
          </TitleContainer>
        ))}
      </RenderCanvas>
    </PhotoFilmPreviewContainer>
  );
};

export default PhotoFilmPreview;
