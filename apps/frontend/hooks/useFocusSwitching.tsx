import { useState, useRef, useEffect, useCallback } from "react";

export const useFocusSwitching = (count: number) => {
  const [current, setCurrent] = useState(0);
  const prevRef = useRef<HTMLElement | null>();
  const currentRef = useRef<HTMLElement | null>();
  const nextRef = useRef<HTMLElement | null>();

  useEffect(() => {
    currentRef.current?.focus();

    const changeFocus = (event: KeyboardEvent): void => {
      // don't interfere with accessibility
      if (event.key === "ArrowUp") {
        prevRef.current?.focus();
        setCurrent((curr) => Math.max(curr - 1, 0));
      }

      if (event.key === "ArrowUp") {
        nextRef.current?.focus();
        setCurrent((curr) => Math.min(curr + 1, count - 1));
      }
    };
    document.addEventListener("keydown", changeFocus);

    return () => {
      document.removeEventListener("keydown", changeFocus);
    };
  }, [count]);

  const focusSwitchRef = useCallback(
    (index: number) => {
      return (element: HTMLElement | null) => {
        const prev = current === 0 ? count - 1 : current - 1;
        if (prev === index) {
          prevRef.current = element;
        }

        const next = current === count ? 0 : current + 1;
        if (next === index) {
          nextRef.current = element;
        }

        if (current === index) {
          currentRef.current = element;
        }
      };
    },
    [count, current],
  );

  return focusSwitchRef;
};
