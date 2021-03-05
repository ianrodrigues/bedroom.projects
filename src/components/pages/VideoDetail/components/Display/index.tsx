import * as i from 'types';
import React from 'react';

import { useAnimationFrame } from 'hooks';
import { isRef } from 'services/typeguards';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';

import FullscreenCanvas from 'common/presentation/FullscreenCanvas';


let video: HTMLVideoElement;
let img: HTMLImageElement;


const Display = React.forwardRef<HTMLCanvasElement, Props>((_props, ref) => {
  // Dirty type fix
  const props = _props as ClonedProps;

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
    if (!isRef<HTMLCanvasElement>(ref)) {
      return;
    }

    if (!ref.current || !video) {
      return;
    }

    const ctx = ref.current.getContext('2d');

    if (!props.controls.started && img) {
      drawCoverFitImage(ctx!, img);
    }

    if (props.controls.playing) {
      drawCoverFitVideo(ctx!, video);
    }
  }, [ref, props.controls]);

  return (
    <FullscreenCanvas ref={ref} height={window.innerHeight - 50} show />
  );
});

interface Props {
  videoObject: i.APIMediaObject;
}

interface ClonedProps extends Props {
  controls: {
    playing: boolean;
    started: boolean;
    volume: number;
  };
}

export default Display;
