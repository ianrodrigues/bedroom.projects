import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-router';

import useStore from 'state';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const state = useStore();
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

    state.videoPlayer.setReady(false);
  }, [location.pathname]);

  React.useEffect(() => {
    videoRef.current?.addEventListener('canplay', function () {
      setControlsDimensions({
        width: this.clientWidth,
        height: this.clientHeight,
      });

      // Wait a bit for everything to load
      setTimeout(() => {
        state.videoPlayer.setReady(true);
      }, 1000);
    });
  }, [videoRef]);

  React.useEffect(() => {
    if (state.videoPlayer.isReady && !state.videoPlayer.isPlaying) {
      setTimeout(() => {
        state.videoPlayer.setPlaying(true);
      }, 3500);
    }
  }, [state.videoPlayer.isReady]);

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
