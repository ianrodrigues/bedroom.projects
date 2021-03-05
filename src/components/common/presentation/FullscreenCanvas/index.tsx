import React from 'react';

import { useEventListener } from 'hooks';
import { isRef } from 'services/typeguards';

import { Canvas } from './styled';

const FullscreenCanvas = React.forwardRef<HTMLCanvasElement, Props>((props, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  function getCanvasElement(): HTMLCanvasElement | null {
    if (!!ref && !isRef<HTMLCanvasElement>(ref)) {
      return null;
    }

    if (!ref && !canvasRef.current) {
      return null;
    }

    return ref?.current || canvasRef.current;
  }

  // Add window resize events
  const setCanvasSize = React.useCallback(() => {
    const canvas = getCanvasElement();

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = props.height || window.innerHeight;
    }
  }, []);

  useEventListener('resize', setCanvasSize);

  // Init canvas
  React.useEffect(() => {
    const canvas = getCanvasElement();

    if (canvas) {
      // Set canvas size
      setCanvasSize();

      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }
    }
  }, [canvasRef, ref]);

  return (
    <Canvas ref={ref || canvasRef} show={props.show!} />
  );
});

FullscreenCanvas.defaultProps = {
  show: true,
};

interface Props {
  show?: boolean;
  height?: number;
}

export default FullscreenCanvas;
