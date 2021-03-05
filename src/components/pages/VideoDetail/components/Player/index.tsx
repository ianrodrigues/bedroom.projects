import * as i from 'types';
import React from 'react';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  return (
    <PlayerContainer>
      <PlayerControls
        width={canvasRef.current?.width}
        height={canvasRef.current?.height}
      >
        <Display ref={canvasRef} videoObject={props.videoObject} />
      </PlayerControls>
    </PlayerContainer>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
