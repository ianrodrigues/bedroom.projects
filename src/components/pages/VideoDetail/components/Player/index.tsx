import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';

import { useShallowStore } from 'hooks';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import PlayerControls from '../PlayerControls';
import Display from '../Display';

import { PlayerContainer } from './styled';


const Player: React.VFC<Props> = (props) => {
  const videoPlayer = useShallowStore('videoPlayer', ['setReady', 'setPlaying', 'isPlaying']);
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
    if (loader?.allLoaded) {
      setVideoStartStatus((obj) => {
        obj.appLoaded = true;
        return obj;
      });
    }
  }, [loader?.allLoaded]);

  React.useEffect(() => {
    if (videoStartStatus.appLoaded && videoStartStatus.videoLoaded) {
      setTimeout(() => {
        videoPlayer.setReady(true);
      }, 1000);

      setTimeout(() => {
        videoRef?.current?.play();
      }, 2200);
    }
  }, [videoStartStatus.appLoaded, videoStartStatus.videoLoaded]);

  // Reset player
  React.useEffect(() => {
    setControlsDimensions({
      width: 0,
      height: 0,
    });

    videoPlayer.setReady(false);
    videoPlayer.setPlaying(false);
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

    this.removeEventListener('loadstart', onLoadStart);
  }

  function onPlaying(this: HTMLVideoElement) {
    setVideoStartStatus((obj) => {
      obj.videoLoaded = true;
      return obj;
    });

    setControlsDimensions({
      width: this.clientWidth,
      height: this.clientHeight,
    });

    videoPlayer.setPlaying(!this.paused);
  }

  function onCanPlay() {
    setVideoStartStatus((obj) => {
      obj.videoLoaded = true;
      return obj;
    });
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

    if (video.paused && videoPlayer.isPlaying) {
      video.play();
    } else if (!video.paused && !videoPlayer.isPlaying) {
      video.pause();
    }
  }, [videoPlayer.isPlaying]);

  return (
    <PlayerContainer id="player-container">
      <PlayerControls videoRef={videoRef} {...controlsDimensions}>
        <Display ref={videoRef} videoObject={props.videoObject} />
      </PlayerControls>
    </PlayerContainer>
  );
};

export interface Props {
  videoObject: i.APIMediaObject;
}

export default Player;
