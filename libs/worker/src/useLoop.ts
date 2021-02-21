import { useCallback, useEffect, useRef } from "react";

// don't need 60fps updates yet
const INTERVAL = 100;

export const useLoop = (callback: (delta: number) => void) => {
  const request = useRef<number | undefined>();
  const previous = useRef<number | undefined>();

  const gameLoop = useCallback(
    (time: number) => {
      if (previous.current === undefined) {
        previous.current = time;
      }
      const delta = time - previous.current;
      if (delta < INTERVAL) {
        requestAnimationFrame(gameLoop);
        return;
      }

      callback(delta);
      previous.current = time;
      requestAnimationFrame(gameLoop);
    },
    [callback],
  );

  useEffect(() => {
    request.current = requestAnimationFrame(gameLoop);
    return () => {
      request.current && cancelAnimationFrame(request.current);
    };
  }, [gameLoop]);
};
