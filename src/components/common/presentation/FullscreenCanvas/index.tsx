import React from 'react';

import { useEventListener } from 'hooks';
import { isRef } from 'services/typeguards';

import { Canvas } from './styled';


const FullscreenCanvas = React.forwardRef<HTMLCanvasElement, Props>((props, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const getCanvasElement = React.useCallback((): HTMLCanvasElement | null => {
    if (!!ref && !isRef<HTMLCanvasElement>(ref)) {
      return null;
    }

    if (!ref && !canvasRef.current) {
      return null;
    }

    return ref?.current || canvasRef.current;
  }, [canvasRef.current, ref]);

  const setCanvasSize = React.useCallback((): void => {
    const canvas = getCanvasElement();

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = props.height || window.innerHeight;
    }
  }, [props.height]);

  // Add window resize events
  useEventListener('resize', setCanvasSize);

  // Init canvas
  React.useEffect(() => {
    const canvas = getCanvasElement();

    if (canvas) {
      setCanvasSize();
    }
  }, [canvasRef.current, ref]);

  return (
    <Canvas ref={ref || canvasRef} $visible={props.visible!} />
  );
});

FullscreenCanvas.defaultProps = {
  visible: true,
};

interface Props {
  visible?: boolean;
  height?: number;
}

export default FullscreenCanvas;
