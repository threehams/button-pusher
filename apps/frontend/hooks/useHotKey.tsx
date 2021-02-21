import { useEffect } from "react";

export const useKeyHandler = (handler: (keyPressed: string) => void) => {
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key) {
        handler(event.key);
      }
    };
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [handler]);
};
