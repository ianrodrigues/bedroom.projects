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
}

// Load images
const sources = [Aw2Cover, Aw3Cover];
const images: HTMLImageElement[] = [];

const Home: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mouseData, setMouseData] = React.useState<MouseData>({
    side: null,
    proximity: null,
  });

  useAnimationFrame((({ time }) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    const widths = [canvas.width, canvas.width * 0.5];
    let widthPct = 0.5;

    if (mouseData.proximity === 'middle') {
      widthPct = 0.75;
    } else if (mouseData.proximity === 'edge') {
      if (mouseData.side === 'R') {
        widthPct = 0.5;
      } else {
        widthPct = 1;
      }
    }

    if (mouseData.side === 'L') {
      widths[1] = canvas.width * widthPct;
    } else if (mouseData.side === 'R') {
      widths[1] = canvas.width * (0.5 - (1 - widthPct));
    }

    for (let i = 0; i < images.length; i++) {
      drawCoverFitImage(
        ctx!,
        images[i],
        0,
        0,
        widths[i],
        canvas.height,
        0,
      );
    }
  }), [mouseData]);

  // Add mouseover events
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    // Left side
    if (e.clientX < canvasRef.current!.width / 2) {
      setMouseData({
        side: 'L',
        proximity: e.clientX < 50 ? 'edge' : 'middle',
      });
    // Right side
    } else {
      setMouseData({
        side: 'R',
        proximity: e.clientX > canvasRef.current!.width - 50 ? 'edge' : 'middle',
      });
    }
  }, [setMouseData]);

  useEventListener('mousemove', onMouseMove);

  const onMouseLeave = React.useCallback((e: MouseEvent) => {
    setMouseData({
      side: null,
      proximity: null,
    });
  }, [setMouseData]);

  useEventListener('mouseleave', onMouseLeave);


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
  }, [canvasRef]);

  return (
    <HomeContainer>
      <span>mouse position: {mouseData.side}, {mouseData.proximity}</span>
      <Canvas ref={canvasRef} />
    </HomeContainer>
  );
};

export default Home;
