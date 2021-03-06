import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-router';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const location = useLocation();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [controlsDimensions, setControlsDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    setControlsDimensions({
      width: 0,
      height: 0,
    });
  }, [location.pathname]);

  React.useEffect(() => {
    videoRef.current?.addEventListener('canplay', function () {
      setControlsDimensions({
        width: this.clientWidth,
        height: this.clientHeight,
      });
    });
  }, [videoRef]);

  return (
    <PlayerContainer id="player-container">
      <PlayerControls {...controlsDimensions}>
        <Display ref={videoRef} videoObject={props.videoObject} />
      </PlayerControls>
    </PlayerContainer>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
