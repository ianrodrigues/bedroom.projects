import React from 'react';

import FullscreenSvg from 'vectors/expand-solid.svg';

import { FullscreenButton } from './styled';


const Fullscreen: React.VFC<Props> = (props) => {
  function handleClick() {
    props.videoRef?.current?.requestFullscreen();
  }

  return (
    <FullscreenButton onClick={handleClick} visible={props.visible}>
      <FullscreenSvg />
    </FullscreenButton>
  );
};

export type Props = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  visible?: boolean;
};

export default Fullscreen;
