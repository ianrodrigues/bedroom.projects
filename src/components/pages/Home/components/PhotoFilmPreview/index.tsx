import React from 'react';

import useStore from 'state';

import Canvas from './Canvas';
import { Name } from './styled';


const PhotoFilmPreview: React.VFC = () => {
  const state = useStore();

  return (
    <>
      <Name show={state.showName}>bedroom</Name>
      <Canvas />
    </>
  );
};

export default PhotoFilmPreview;
