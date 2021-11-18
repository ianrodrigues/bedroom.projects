import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';

import useStore from 'state';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

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
  const [videoStartStatus, setVideoStartStatus] = React.useState({
    appLoaded: false,
    videoLoaded: false,
  });
  const loader = React.useContext(AssetsLoaderContext);

  React.useEffect(() => {
    if (loader.allLoaded) {
      setVideoStartStatus((obj) => {
        obj.appLoaded = true;
        return obj;
      });
    }
  }, [loader.allLoaded]);

  React.useEffect(() => {
    if (videoStartStatus.appLoaded && videoStartStatus.videoLoaded) {
      setTimeout(() => {
        state.videoPlayer.setReady(true);
      }, 1000);

      setTimeout(() => {
        state.videoPlayer.setPlaying(true);
      }, 2200);
    }
  }, [videoStartStatus.appLoaded, videoStartStatus.videoLoaded]);

  // Reset player
  React.useEffect(() => {
    setControlsDimensions({
      width: 0,
      height: 0,
    });

    state.videoPlayer.setReady(false);
    state.videoPlayer.setPlaying(false);
    setVideoStartStatus({
      appLoaded: false,
      videoLoaded: false,
    });
  }, [location.current.pathname]);

  function onLoadStart(this: HTMLVideoElement) {
    setControlsDimensions({
      width: this.clientWidth,
      height: this.clientHeight,
    });

    // Wait a bit for everything to load
    // setTimeout(() => {
    //   state.videoPlayer.setReady(true);
    // }, 1000);

    this.removeEventListener('loadstart', onLoadStart);
  }

  function onPlaying(this: HTMLVideoElement) {
    // state.ui.setLoading(false);
    // state.videoPlayer.setPlaying(true);

    setVideoStartStatus((obj) => {
      obj.videoLoaded = true;
      return obj;
    });

    setControlsDimensions({
      width: this.clientWidth,
      height: this.clientHeight,
    });
  }

  function onCanPlay() {
    setVideoStartStatus((obj) => {
      obj.videoLoaded = true;
      return obj;
    });

    // state.ui.setLoading(false);

    // setTimeout(() => {
    //   state.videoPlayer.setPlaying(true);
    // }, 2200);
  }

  function onWindowResize() {
    if (videoRef.current) {
      setControlsDimensions({
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight,
      });
    }
  }

  // Video element events
  React.useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.addEventListener('loadstart', onLoadStart);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', onCanPlay);
    window.addEventListener('resize', onWindowResize);
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
