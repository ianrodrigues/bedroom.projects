// Based off a tweet and codesandbox:
// https://mobile.twitter.com/hieuhlc/status/1164369876825169920
import { useEffect, useRef } from 'react';

type CbParams = {
  time: number;
  delta: number;
}

// Reusable component that also takes dependencies
export function useAnimationFrame(cb: (params: CbParams) => void, deps: any[]): void {
  const frame = useRef(-1);
  const last = useRef(performance.now());
  const init = useRef(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = now - init.current;
    const delta = now - last.current;
    cb({ time, delta });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, deps); // Make sure to change it if the deps change
}
