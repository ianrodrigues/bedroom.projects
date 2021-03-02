import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import useStore from 'state';

import Canvas from './Canvas';
import { Name, PhotoFilmPreviewContainer } from './styled';


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
      <Canvas />
    </PhotoFilmPreviewContainer>
  );
};

export default PhotoFilmPreview;
