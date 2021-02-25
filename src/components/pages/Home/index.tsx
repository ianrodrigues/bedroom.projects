import React from 'react';

import Aw2Cover from 'images/aw2-cover.jpg';
import Aw3Cover from 'images/aw3-cover.jpg';

import drawCoverFitImage from 'services/drawCoverFitImage';
import { useAnimationFrame, useEventListener } from 'hooks';

import { Canvas, HomeContainer } from './styled';


type MouseSide = null | 'L' | 'R';

type MouseData = {
  side: MouseSide;
  proximity: null | 'middle' | 'edge';
  animate: boolean;
}

// Load images
const sources = [Aw2Cover, Aw3Cover];
const images: HTMLImageElement[] = [];

const Home: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [startTime, setStartTime] = React.useState(0);
  const [dividerPos, setDividerPos] = React.useState(0);
  const [mouseData, setMouseData] = React.useState<MouseData>({
    side: null,
    proximity: null,
    animate: false,
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

    for (let i = 0; i < images.length; i++) {
      drawCoverFitImage(
        ctx,
        images[i],
        0,
        0,
        !i ? canvas.width : nextDividerPos,
        canvas.height,
        0,
      );
    }
  }), [mouseData, setMouseData, setStartTime, startTime, dividerPos, setDividerPos]);

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
    for (let i = 0; i < sources.length; i++) {
      const img = new Image();
      img.src = sources[i];

      images.push(img);
    }
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
