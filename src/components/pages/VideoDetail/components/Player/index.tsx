import * as i from 'types';
import React from 'react';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [controlsDimensions, setControlsDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    setControlsDimensions({
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    });
  }, [canvasRef]);

  return (
    <PlayerContainer>
      <PlayerControls {...controlsDimensions}>
        <Display ref={canvasRef} videoObject={props.videoObject} />
      </PlayerControls>
    </PlayerContainer>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
