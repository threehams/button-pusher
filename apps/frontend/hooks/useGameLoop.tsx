import { useLoop } from "@botnet/worker";
import { useCallback } from "react";

export const useGameLoop = () => {
  const doStuff = useCallback((delta: number) => {
    // setHeldItem();
  }, []);
  useLoop(doStuff);
};
