import React from 'react';

import useStore, { MediaData, MediaType } from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import mediaDb from 'services/mediaDB';

import { MediaTitle, TitleContainer, TitleInner } from './styled';

type MouseSide = null | 'L' | 'R';

interface MouseData {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
}

interface Media<T extends HTMLVideoElement | HTMLImageElement> {
  [id: number]: MediaData & {
    title: string;
    src: string;
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
  const [mousePos, setMousePos] = React.useState<MouseData>({
    side: null,
    proximity: null,
  });
  const prevMousePos = usePrevious(mousePos);
  const tempPrevPhoto = usePrevious(state.photo);
  const tempPrevVideo = usePrevious(state.video);

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

    if (mousePos.proximity === 'middle') {
      if (mousePos.side === 'L') {
        dividerOffset = 0.75;
      } else if (mousePos.side === 'R') {
        dividerOffset = 0.25;
      }
    } else if (mousePos.proximity === 'edge') {
      if (mousePos.side === 'L') {
        dividerOffset = 1;
      } else if (mousePos.side === 'R') {
        dividerOffset = 0;
      }
    }

    // Animation start
    if (prevMousePos) {
      if (mousePos.proximity !== prevMousePos.proximity || mousePos.side !== prevMousePos.side) {
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

    if (video && !prevPhoto) {
      if (prevVideo) {
        mediaTransition(ctx, 'video', timestamp);
      }

      drawCoverFitVideo(ctx, video.element);
    }

    const photo = photos[state.photo.id];

    if (photo) {
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
  }), [mousePos, setMousePos]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.4) {
      setMousePos({
        side: 'L',
        proximity: e.clientX < canvas.width * 0.2 ? 'edge' : 'middle',
      });
    // Right side
    } else if (e.clientX > canvas.width * 0.6) {
      setMousePos({
        side: 'R',
        proximity: e.clientX > canvas.width * 0.8 ? 'edge' : 'middle',
      });
    } else {
      setMousePos({
        side: null,
        proximity: null,
      });
    }
  }, [setMousePos]);

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
    if (mousePos.proximity === 'edge' && state.showName) {
      state.setShowName(false);
    } else if (mousePos.proximity !== 'edge' && !state.showName) {
      state.setShowName(true);
    }
  }, [mousePos.proximity]);

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
          <MediaTitle show={mousePos.proximity === 'edge' && mousePos.side === 'L'}>
            {state.photo.title}
          </MediaTitle>
          <MediaTitle show={mousePos.proximity === 'edge' && mousePos.side === 'R'}>
            {state.video.title}
          </MediaTitle>
        </TitleInner>
      </TitleContainer>
    </>
  );
};

export default Canvas;
