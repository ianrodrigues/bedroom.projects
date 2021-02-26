import React from 'react';

import useStore from 'state';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import mediaDb from 'services/mediaDB';

import { MediaTitle, TitleContainer, TitleInner } from './styled';

type MouseSide = null | 'L' | 'R';

type MouseData = {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
}

type Media<T extends HTMLVideoElement | HTMLImageElement> = {
  [title: string]: {
    title: string;
    src: string;
    element: T;
  }
}

// React setState can't keep up with high screen refresh rates or quick changes to heavy objects
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;

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

  useAnimationFrame(((props) => {
    const timestamp = props.time;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

    const video = videos[state.video.title];
    if (video) {
      drawCoverFitVideo(ctx, video.element);
    }

    const photo = photos[state.photo.title];
    if (photo) {
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
    for (let i = 0; i < mediaDb.videos.length; i++) {
      const videoData = mediaDb.videos[i];

      if (videoData) {
        const video = document.createElement('video');
        video.id = videoData.title;
        video.src = videoData.src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        videos[videoData.title] = {
          ...videoData,
          element: video,
        };
      }

      const photoData = mediaDb.photos[i];
      if (photoData) {
        const img = document.createElement('img');
        img.src = photoData.src;

        photos[photoData.title] = {
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


  // Init canvas
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    // Set canvas size
    setCanvasSize();

    // Draw shit
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;

    dividerPos = canvas.width * 0.5;
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
