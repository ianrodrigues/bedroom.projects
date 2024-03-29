// Based off a tweet and codesandbox:
// https://mobile.twitter.com/hieuhlc/status/1164369876825169920
import { useEffect, useRef } from 'react';


// Reusable component that also takes dependencies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAnimationFrame(cb: (params: CbParams) => void, deps: unknown[]): void {
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

interface CbParams {
  time: number;
  delta: number;
}
