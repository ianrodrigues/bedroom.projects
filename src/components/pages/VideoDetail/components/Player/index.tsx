import * as i from 'types';
import React from 'react';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

// import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [controlsDimensions, setControlsDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.onresize = () => {
      setControlsDimensions({
        width: videoRef.current!.clientWidth,
        height: videoRef.current!.clientHeight,
      });
    };

    setControlsDimensions({
      width: videoRef.current.clientWidth,
      height: videoRef.current.clientHeight,
    });
  }, [videoRef]);

  return (
    <div id="player-container">
      <PlayerControls {...controlsDimensions}>
        <Display ref={videoRef} videoObject={props.videoObject} />
      </PlayerControls>
    </div>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
