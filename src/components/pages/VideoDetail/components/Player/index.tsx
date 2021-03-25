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

  // Reset player
  React.useEffect(() => {
    setControlsDimensions({
      width: 0,
      height: 0,
    });

    state.videoPlayer.setReady(false);
    state.videoPlayer.setPlaying(false);
  }, [location.pathname]);

  // Video element events
  React.useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.addEventListener('loadstart', function () {
      setControlsDimensions({
        width: this.clientWidth,
        height: this.clientHeight,
      });

      // Wait a bit for everything to load
      setTimeout(() => {
        state.videoPlayer.setReady(true);
      }, 1000);
    });

    video.addEventListener('playing', function () {
      state.setLoading(false);
      state.videoPlayer.setPlaying(true);

      setControlsDimensions({
        width: this.clientWidth,
        height: this.clientHeight,
      });
    });

    video.addEventListener('canplay', function () {
      state.setLoading(false);

      setTimeout(() => {
        state.videoPlayer.setPlaying(true);
      }, 2200);
    });

    window.addEventListener('resize', () => {
      if (videoRef.current) {
        setControlsDimensions({
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        });
      }
    });
  }, [videoRef]);

  // Play/pause state
  React.useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused && state.videoPlayer.isPlaying) {
      video.play();
    } else if (!video.paused && !state.videoPlayer.isPlaying) {
      video.pause();
    }
  }, [state.videoPlayer.isPlaying]);

  return (
    <PlayerContainer id="player-container">
      <PlayerControls videoRef={videoRef} {...controlsDimensions}>
        <Display ref={videoRef} videoObject={props.videoObject} />
      </PlayerControls>
    </PlayerContainer>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
