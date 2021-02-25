import React from 'react';

import Aw2Cover from 'images/aw2-cover.jpg';

import { drawCoverFitImage, drawCoverFitVideo } from 'services';
import { useAnimationFrame, useEventListener } from 'hooks';

import { Canvas, HomeContainer } from './styled';


type MouseSide = null | 'L' | 'R';

type MouseData = {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
  animate: boolean;
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

const Home: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [startTime, setStartTime] = React.useState(0);
  const [dividerPos, setDividerPos] = React.useState(0);
  const [mouseData, setMouseData] = React.useState<MouseData>({
    side: null,
    proximity: null,
    animate: false,
  });
  const [media, setMedia] = React.useState<Media>({
    photo: undefined,
    video: undefined,
  });

  useAnimationFrame(((props) => {
    const timestamp = props.time;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let widthPct = 0.5;
    let nextDividerPos = dividerPos;

    if (mouseData.proximity === 'middle') {
      if (mouseData.side === 'L') {
        widthPct = 0.75;
      } else if (mouseData.side === 'R') {
        widthPct = 0.25;
      }
    } else if (mouseData.proximity === 'edge') {
      if (mouseData.side === 'L') {
        widthPct = 1;
      } else if (mouseData.side === 'R') {
        widthPct = 0;
      }
    }

    if (mouseData.animate) {
      if (!startTime) {
        setStartTime(timestamp);
      }

      const duration = 1.25;
      const targetPos = canvas.width * widthPct;
      const start_time = startTime || timestamp;
      const runtime = timestamp - start_time;
      const relativeProgress = Math.min(runtime / duration, 1);
      const distance = targetPos - dividerPos;
      const relativeDistance = relativeProgress * Math.abs(dividerPos - targetPos);

      if (distance >= 0) {
        nextDividerPos += relativeDistance;
      } else {
        nextDividerPos -= relativeDistance;
      }

      setDividerPos(nextDividerPos);

      if (relativeProgress === 1) {
        setMouseData((prev) => ({
          ...prev,
          animate: false,
        }));

        setStartTime(0);
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
  }), [mouseData, setMouseData, setStartTime, startTime, dividerPos, setDividerPos, media]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    // Left side
    if (e.clientX < canvas.width * 0.25) {
      setMouseData({
        side: 'L',
        proximity: e.clientX < 100 ? 'edge' : 'middle',
        animate: true,
      });
    // Right side
    } else if (e.clientX > canvas.width * 0.75) {
      setMouseData({
        side: 'R',
        proximity: e.clientX > canvas.width - 100 ? 'edge' : 'middle',
        animate: true,
      });
    } else {
      setMouseData({
        side: null,
        proximity: null,
        animate: true,
      });
    }
  }, [setMouseData]);

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

    setDividerPos(canvas.width * 0.5);
  }, [canvasRef]);

  return (
    <HomeContainer>
      <span>mouse position: {mouseData.side}, {mouseData.proximity}</span>
      <Canvas ref={canvasRef} />
    </HomeContainer>
  );
};

export default Home;
