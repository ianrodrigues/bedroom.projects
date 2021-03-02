import * as i from 'types';
import React from 'react';

import useStore from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { isVideo, isPhoto } from 'services/typeguards';

import FullscreenCanvas from 'common/presentation/FullscreenCanvas';

type Side = 'L' | 'R';
type SizeData = Record<Side, null | 'large' | 'full'>

interface Media<T extends HTMLVideoElement | HTMLImageElement> {
  [id: number]: i.APIMediaObject & {
    element: T;
  }
}

// React setState can't keep up with high screen refresh rates or quick changes to heavy objects
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;
let transitionStartTime = 0;
let prevPhoto: i.APIMediaObject | undefined;
let prevVideo: i.APIMediaObject | undefined;

// We keep all videos and photos in memory with these objects for super fast switching between
// different photos/films
const videos: Media<HTMLVideoElement> = {};
const photos: Media<HTMLImageElement> = {};


const Canvas: React.FC<Props> = (props) => {
  const state = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const tempPrevPhoto = usePrevious(state.photo);
  const tempPrevVideo = usePrevious(state.video);
  const [sizeData, setSizeData] = React.useState<SizeData>({
    L: null,
    R: null,
  });
  const prevSideSize = usePrevious(sizeData);

  // Omega ugly but works for now :)
  const mediaTransition = React.useCallback(
    (ctx: CanvasRenderingContext2D, mediaType: i.MediaType, timestamp: number) => {
      if (!state.photo || !state.video) {
        return;
      }

      const collection = mediaType === 'photo' ? photos : videos;
      const media = mediaType === 'photo' ? photos[state.photo.id] : videos[state.video.id];
      const prevMedia = mediaType === 'photo' ? prevPhoto : prevVideo;

      if (!media) {
        return;
      }

      if (transitionStartTime === 0 && prevMedia!.id !== media.id) {
        transitionStartTime = timestamp;
      }

      if (transitionStartTime > 0) {
        const duration = .4;
        const runtime = timestamp - transitionStartTime;
        const relativeProgress = Math.min(runtime / duration, 1);
        const alpha1 = 1 - relativeProgress;
        const alpha2 = relativeProgress;

        ctx.globalAlpha = alpha1;

        if (mediaType === 'video') {
          drawCoverFitVideo(
            ctx,
            collection[prevMedia!.id]!.element as HTMLVideoElement,
          );
        } else {
          let width = Math.min(dividerPos, window.innerWidth);

          if (props.fullscreen === 'photo') {
            width = window.innerWidth;
          }

          drawCoverFitImage(
            ctx,
            collection[prevMedia!.id]!.element as HTMLImageElement,
            width,
            ctx.canvas.height,
          );
        }

        ctx.globalAlpha = alpha2;

        if (relativeProgress === 1) {
          transitionStartTime = 0;
          prevVideo = undefined;
          prevPhoto = undefined;
        }
      }
    }, [state.photo, state.video]);

  useAnimationFrame(((animProps) => {
    const timestamp = animProps.time;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    // Clear all canvas pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start in the middle
    let dividerOffset = 0.5;

    switch (sizeData.L) {
      case 'large': dividerOffset = 0.75; break;
      case 'full': dividerOffset = 1; break;
    }
    switch (sizeData.R) {
      case 'large': dividerOffset = 0.25; break;
      case 'full': dividerOffset = 0; break;
    }

    // Animation start
    if (prevSideSize) {
      if (sizeData.L !== prevSideSize.L || sizeData.R !== prevSideSize.R) {
        startTime = timestamp;
      }
    }

    // Animate position of divider
    if (startTime > 0) {
      const duration = 1.25;
      const targetPos = canvas.width * dividerOffset;
      const runtime = timestamp - startTime;
      const distance = targetPos - dividerPos;
      const relativeProgress = Math.min(runtime / duration, 1);
      const relativeDistance = relativeProgress * Math.abs(dividerPos - targetPos);

      if (distance >= 0) {
        dividerPos += relativeDistance;
      } else {
        dividerPos -= relativeDistance;
      }

      // Done
      if (relativeProgress === 1) {
        startTime = 0;
      }
    }

    if (state.video && props.fullscreen !== 'photo') {
      const video = videos[state.video.id];

      // Don't render video if photo is fullscreen
      if (video && dividerPos !== window.innerWidth) {
        if (prevVideo) {
          mediaTransition(ctx, 'video', timestamp);
        }

        drawCoverFitVideo(ctx, video.element);
      }
    }

    if (state.photo && props.fullscreen !== 'video') {
      const photo = photos[state.photo.id];

      // Don't render photo if video is fullscreen
      if (photo && dividerPos !== 0) {
        if (prevPhoto) {
          mediaTransition(ctx, 'photo', timestamp);
        }

        let width = Math.min(dividerPos, window.innerWidth);

        if (props.fullscreen === 'photo') {
          width = window.innerWidth;
        }

        drawCoverFitImage(
          ctx,
          photo.element,
          width,
          canvas.height,
        );
      }
    }
  }), [sizeData, state.photo, state.video, props.fullscreen]);

  // Add mouseover events
  useEventListener('mousemove', React.useCallback((e: MouseEvent) => {
    if (props.fullscreen) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.3) {
      setSizeData((prev) => ({
        ...prev,
        L: state.isFullscreen ? 'full' : 'large',
      }));
    // Right side
    } else if (e.clientX > canvas.width * 0.7) {
      setSizeData((prev) => ({
        ...prev,
        R: state.isFullscreen ? 'full' : 'large',
      }));
    } else {
      setSizeData({
        L: null,
        R: null,
      });
    }
  }, [setSizeData, state.isFullscreen]));

  // Init photo/video into memory
  React.useEffect(() => {
    if (!state.allMedia) {
      return;
    }

    if (Object.keys(videos).length > 0 || Object.keys(photos).length > 0) {
      return;
    }

    for (let i = 0; i < Math.max(state.allMedia.video.length, state.allMedia.photo.length); i++) {
      const videoData = state.allMedia.video[i];
      const videoMedia = videoData?.media_cover;

      if (videoData && isVideo(videoMedia)) {
        const video = document.createElement('video');
        video.id = videoData.title;
        video.src = CMS_URL + videoMedia.url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        videos[videoData.id] = {
          ...videoData,
          element: video,
        };
      }

      const photoData = state.allMedia.photo[i];
      const photoMedia = photoData?.media_cover;

      if (photoData && isPhoto(photoMedia)) {
        const img = document.createElement('img');
        const format = photoMedia.formats.large || photoMedia.formats.medium || photoMedia.formats.small;
        img.src = CMS_URL + format.url;

        photos[photoData.id] = {
          ...photoData,
          element: img,
        };
      }
    }
  }, [state.allMedia]);

  // Show "bedroom" title
  React.useEffect(() => {
    if (state.isFullscreen && state.showName) {
      state.setShowName(false);
    } else if (!state.isFullscreen && !state.showName) {
      state.setShowName(true);
    }
  }, [state.isFullscreen]);

  // Used for transitions between media
  React.useEffect(() => {
    prevPhoto = tempPrevPhoto;
  }, [state.photo]);

  React.useEffect(() => {
    prevVideo = tempPrevVideo;
  }, [state.video]);

  // Init divider position
  React.useEffect(() => {
    dividerPos = canvasRef.current!.width * 0.5;
  }, [canvasRef]);

  return (
    <>
      <FullscreenCanvas ref={canvasRef} />
      {props.children && props.children({
        sizeData,
      })}
    </>
  );
};

interface RenderProps {
  sizeData: SizeData;
}

interface Props {
  children?: (props: RenderProps) => void;
  fullscreen?: 'photo' | 'video';
}

export default Canvas;
