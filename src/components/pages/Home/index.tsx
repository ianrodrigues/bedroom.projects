import React from 'react';

import Aw2Cover from 'images/aw2-cover.jpg';

import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { useAnimationFrame, useEventListener, usePrevious } from 'hooks';

import { Canvas, HomeContainer } from './styled';


type MouseSide = null | 'L' | 'R';

type MouseData = {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
}

type Media = {
  photo?: HTMLImageElement;
  video?: HTMLVideoElement;
}

// Load images
const sources = [
  'https://bedroom.sandervispoel.com/static/beabadoobee__worth_it.mov',
  Aw2Cover,
];

// React setState can't keep up with high screen refresh rates
// We also don't need these variables to fire renders
let dividerPos = 0;
let startTime = 0;

const Home: React.FC = () => {
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let dividerOffset = 0.5;
    let nextDividerPos = dividerPos;

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

    if (mousePos.proximity !== prevMousePos.proximity || mousePos.side !== prevMousePos.side) {
      startTime = timestamp;
    }

    if (startTime > 0) {
      const duration = 1.25;
      const targetPos = canvas.width * dividerOffset;
      const runtime = timestamp - startTime;
      const distance = targetPos - dividerPos;
      const relativeProgress = Math.min(runtime / duration, 1);
      const relativeDistance = relativeProgress * Math.abs(dividerPos - targetPos);

      if (distance >= 0) {
        nextDividerPos += relativeDistance;
      } else {
        nextDividerPos -= relativeDistance;
      }

      dividerPos = nextDividerPos;

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
        nextDividerPos,
        canvas.height,
        0,
      );
    }
  }), [mousePos, setMousePos, media]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.25) {
      setMousePos({
        side: 'L',
        proximity: e.clientX < 100 ? 'edge' : 'middle',
      });
    // Right side
    } else if (e.clientX > canvas.width * 0.75) {
      setMousePos({
        side: 'R',
        proximity: e.clientX > canvas.width - 100 ? 'edge' : 'middle',
      });
    } else {
      setMousePos({
        side: null,
        proximity: null,
      });
    }
  }, [setMousePos]);

  useEventListener('mousemove', onMouseMove);


  // Init component
  React.useEffect(() => {
    const video = document.createElement('video');
    video.src = sources[0];
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.oncanplaythrough = () => {
      setMedia((prev) => ({
        ...prev,
        video,
      }));
    };

    const img = new Image();
    img.src = sources[1];
    img.onload = () => setMedia((prev) => ({
      ...prev,
      photo: img,
    }));
  }, []);


  // Init canvas
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw shit
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;

    dividerPos = canvas.width * 0.5;
  }, [canvasRef]);

  return (
    <HomeContainer>
      <span>
        mouse position: {mousePos.side}, {mousePos.proximity}
        -- anim start time: {startTime}
        -- divider pos: {dividerPos}
      </span>
      <Canvas ref={canvasRef} />
    </HomeContainer>
  );
};

export default Home;
