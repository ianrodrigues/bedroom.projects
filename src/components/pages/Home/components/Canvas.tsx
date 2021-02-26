import React from 'react';

import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';
import useStore from 'state';
import mediaDb from 'services/mediaDB';

type MouseSide = null | 'L' | 'R';

type MouseData = {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
}

type Media = {
  photo?: HTMLImageElement;
  video?: HTMLVideoElement;
}

// React setState can't keep up with high screen refresh rates
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;

const Canvas: React.VFC = () => {
  const state = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = React.useState<MouseData>({
    side: null,
    proximity: null,
  });
  const prevMousePos = usePrevious(mousePos);
  const [media, setMedia] = React.useState<Media>({
    photo: undefined,
    video: undefined,
  });

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

    if (media.video) {
      drawCoverFitVideo(ctx, media.video);
    }

    if (media.photo) {
      drawCoverFitImage(
        ctx,
        media.photo,
        0,
        0,
        Math.min(dividerPos, window.innerWidth),
        canvas.height,
        0,
        0,
      );
    }
  }), [mousePos, setMousePos, media]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.33) {
      setMousePos({
        side: 'L',
        proximity: e.clientX < canvas.width * 0.075 ? 'edge' : 'middle',
      });
    // Right side
    } else if (e.clientX > canvas.width * 0.67) {
      setMousePos({
        side: 'R',
        proximity: e.clientX > canvas.width * 0.925 ? 'edge' : 'middle',
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
      const video = document.createElement('video');
      video.id = videoData.title;
      video.src = videoData.src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;

      if (i === 0) {
        video.oncanplaythrough = () => {
          setMedia((prev) => ({
            ...prev,
            video,
          }));
        };
      }
    }

    const img = new Image();
    img.src = state.photo.src;
    img.onload = () => setMedia((prev) => ({
      ...prev,
      photo: img,
    }));
  }, []);


  React.useEffect(() => {
    if (media.photo) {
      media.photo.src = state.photo.src;
    }
  }, [state.photo]);

  React.useEffect(() => {
    if (media.video) {
      media.video.src = state.video.src;
    }
  }, [state.video]);


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
    <canvas ref={canvasRef} />
  );
};

export default Canvas;
