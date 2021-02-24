import React from 'react';

import Aw2Cover from 'images/aw2-cover.jpg';
import Aw3Cover from 'images/aw3-cover.jpg';

import drawCoverFitImage from 'services/drawCoverFitImage';

import { Canvas, HomeContainer } from './styled';


type MouseSide = null | 'L' | 'R';

// Load images
const sources = [Aw2Cover, Aw3Cover];
const images: HTMLImageElement[] = [];

const Home: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mouseSide, setMouseSide] = React.useState<MouseSide>(null);
  const [_, setMediaLoaded] = React.useState({
    amount: 0,
    done: false,
  });

  function drawPreviews(side: MouseSide = null, widthPct = 0.5) {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    const widths = [canvas.width, canvas.width * 0.5];

    if (side === 'L') {
      widths[1] = canvas.width * widthPct;
    } else if (side === 'R') {
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
  }

  function onMouseMove(e: MouseEvent) {
    // Left side
    if (e.clientX < canvasRef.current!.width / 2) {
      if (e.clientX < 50) {
        drawPreviews('L', 1);
      } else {
        drawPreviews('L', 0.75);
      }
    // Right side
    } else {
      if (e.clientX > canvasRef.current!.width - 50) {
        drawPreviews('R', 0.5);
      } else {
        drawPreviews('R', 0.75);
      }
    }
  }

  function onMouseLeave(e: MouseEvent) {
    drawPreviews();
  }

  function draw() {
    drawPreviews();
  }

  React.useEffect(() => {
    for (let i = 0; i < sources.length; i++) {
      const img = new Image();
      img.src = sources[i];

      img.addEventListener('load', () => {
        setMediaLoaded((prev) => {
          const amount = prev.amount + 1;
          const done = amount === images.length;

          if (done) {
            draw();
          }

          return { amount, done };
        });
      });

      images.push(img);
    }
  }, []);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add mouseover events
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // Draw shit
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;

    requestAnimationFrame(draw);

    return function cleanup() {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [canvasRef]);

  return (
    <HomeContainer>
      <Canvas ref={canvasRef} />
    </HomeContainer>
  );
};

export default Home;
