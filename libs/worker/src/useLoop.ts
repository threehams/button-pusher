import { useEffect, useRef } from "react";

// don't need 60fps updates yet
const INTERVAL = 100;

export const useLoop = (callback: (delta: number) => void) => {
  const previous = useRef<number | undefined>();
  const savedCallback = useRef<(delta: number) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = (time: number) => {
      if (previous.current === undefined) {
        previous.current = time;
      }
      const delta = time - previous.current;
      if (delta < INTERVAL) {
        requestAnimationFrame(loop);
        return;
      }

      savedCallback.current?.(delta);
      previous.current = time;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
    };
  }, []);
};
