import * as i from 'types';
import React from 'react';

import { useAnimationFrame } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';

import FullscreenCanvas from 'common/presentation/FullscreenCanvas';

import useControls from './useControls';
import { PlayerContainer } from './styled';


let video: HTMLVideoElement;
let img: HTMLImageElement;


const Player: React.VFC<Props> = (props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const controls = useControls();


  React.useEffect(() => {
    if (props.videoObject && props.videoObject.full_video) {
      video = document.createElement('video');
      video.src = CMS_URL + props.videoObject.full_video.url;
      video.autoplay = false;
      video.loop = false;
      video.muted = false;

      if (props.videoObject.video_poster) {
        img = document.createElement('img');
        img.src = CMS_URL + props.videoObject.video_poster.url;
      }
    }
  }, [props.videoObject]);

  useAnimationFrame(() => {
    if (!canvasRef.current || !video) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');

    if (!controls.started && img) {
      drawCoverFitImage(ctx!, img);
    }

    if (controls.playing) {
      drawCoverFitVideo(ctx!, video);
    }
  }, [canvasRef, controls]);

  return (
    <PlayerContainer>
      <FullscreenCanvas ref={canvasRef} height={window.innerHeight - 50} show />
    </PlayerContainer>
  );
};

export type Props = {
  videoObject: i.APIMediaObject;
};

export default Player;
