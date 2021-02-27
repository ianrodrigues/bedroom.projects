import React from 'react';

import useStore, { MediaData, MediaType } from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import mediaDb from 'services/mediaDB';

import { MediaTitle, TitleContainer, TitleInner } from './styled';

type Side = 'L' | 'R';
export type MouseSide = null | Side;

type SizeData = Record<Side, null | 'large' | 'full'>

interface Media<T extends HTMLVideoElement | HTMLImageElement> {
  [id: number]: MediaData & {
    element: T;
  }
}

// React setState can't keep up with high screen refresh rates or quick changes to heavy objects
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;
let transitionStartTime = 0;
let prevPhoto: MediaData | undefined;
let prevVideo: MediaData | undefined;

// We keep all videos and photos in memory with these objects for super fast switching between
// different photos/films
const videos: Media<HTMLVideoElement> = {};
const photos: Media<HTMLImageElement> = {};


const Canvas: React.VFC = () => {
  const state = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [sideSize, setSideSize] = React.useState<SizeData>({
    L: null,
    R: null,
  });
  const prevSideSize = usePrevious(sideSize);
  const tempPrevPhoto = usePrevious(state.photo);
  const tempPrevVideo = usePrevious(state.video);

  // Omega ugly but works for now :)
  const mediaTransition = React.useCallback(
    (ctx: CanvasRenderingContext2D, mediaType: MediaType, timestamp: number) => {
      const collection = mediaType === 'photo' ? photos : videos;
      const media = mediaType === 'photo' ? photos[state.photo.id] : videos[state.video.id];
      const prevMedia = mediaType === 'photo' ? prevPhoto : prevVideo;

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
            collection[prevMedia!.id].element as HTMLVideoElement,
          );
        } else {
          drawCoverFitImage(
            ctx,
            collection[prevMedia!.id].element as HTMLImageElement,
            0,
            0,
            Math.min(dividerPos, window.innerWidth),
            ctx.canvas.height,
            0,
            0,
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

  useAnimationFrame(((props) => {
    const timestamp = props.time;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    // Clear all canvas pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start in the middle
    let dividerOffset = 0.5;

    switch (sideSize.L) {
      case 'large': dividerOffset = 0.75; break;
      case 'full': dividerOffset = 1; break;
    }
    switch (sideSize.R) {
      case 'large': dividerOffset = 0.25; break;
      case 'full': dividerOffset = 0; break;
    }

    // Animation start
    if (prevSideSize) {
      if (sideSize.L !== prevSideSize.L || sideSize.R !== prevSideSize.R) {
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

    const video = videos[state.video.id];

    // Don't render video if photo is fullscreen
    if (video && dividerPos !== window.innerWidth) {
      if (prevVideo) {
        mediaTransition(ctx, 'video', timestamp);
      }

      drawCoverFitVideo(ctx, video.element);
    }

    const photo = photos[state.photo.id];

    // Don't render photo if video is fullscreen
    if (photo && dividerPos !== 0) {
      if (prevPhoto) {
        mediaTransition(ctx, 'photo', timestamp);
      }

      drawCoverFitImage(
        ctx,
        photo.element,
        0,
        0,
        Math.min(dividerPos, window.innerWidth),
        canvas.height,
        0,
        0,
      );
    }
  }), [sideSize]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.3) {
      setSideSize((prev) => ({
        ...prev,
        L: state.isFullscreen ? 'full' : 'large',
      }));
    // Right side
    } else if (e.clientX > canvas.width * 0.7) {
      setSideSize((prev) => ({
        ...prev,
        R: state.isFullscreen ? 'full' : 'large',
      }));
    } else {
      setSideSize({
        L: null,
        R: null,
      });
    }
  }, [setSideSize, state.isFullscreen]);

  const setCanvasSize = React.useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEventListener('mousemove', onMouseMove);
  useEventListener('resize', setCanvasSize);


  // Init component
  React.useEffect(() => {
    for (let i = 0; i < Math.max(mediaDb.videos.length, mediaDb.photos.length); i++) {
      const videoData = mediaDb.videos[i];

      if (videoData) {
        const video = document.createElement('video');
        video.id = videoData.title;
        video.src = videoData.src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        videos[videoData.id] = {
          ...videoData,
          element: video,
        };
      }

      const photoData = mediaDb.photos[i];

      if (photoData) {
        const img = document.createElement('img');
        img.src = photoData.src;

        photos[photoData.id] = {
          ...photoData,
          element: img,
        };
      }
    }
  }, []);

  React.useEffect(() => {
    if (state.isFullscreen && state.showName) {
      state.setShowName(false);
    } else if (!state.isFullscreen && !state.showName) {
      state.setShowName(true);
    }
  }, [state.isFullscreen]);

  React.useEffect(() => {
    prevPhoto = tempPrevPhoto;
  }, [state.photo]);

  React.useEffect(() => {
    prevVideo = tempPrevVideo;
  }, [state.video]);

  // Init canvas
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    setCanvasSize();
    dividerPos = canvas.width * 0.5;

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;
  }, [canvasRef]);

  return (
    <>
      <canvas ref={canvasRef} />
      <TitleContainer>
        <TitleInner>
          <MediaTitle show={state.isFullscreen && sideSize.L === 'full'}>
            {state.photo.title}
          </MediaTitle>
          <MediaTitle show={state.isFullscreen && sideSize.R === 'full'}>
            {state.video.title}
          </MediaTitle>
        </TitleInner>
      </TitleContainer>
    </>
  );
};

export default Canvas;
