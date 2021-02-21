import { useState, useCallback } from "react";

export const useSet = <T extends unknown>(initial: T[]) => {
  const [state, setState] = useState(initial);
  const add = useCallback((item: T) => {
    setState((current) => [...current, item]);
  }, []);
  const has = useCallback(
    (item: T) => {
      return state.includes(item);
    },
    [state],
  );
  const remove = useCallback((item: T) => {
    setState((current) =>
      current.filter((currentItem) => currentItem !== item),
    );
  }, []);
  const toggle = useCallback(
    (item: T) => {
      has(item) ? remove(item) : add(item);
    },
    [add, has, remove],
  );
  return { add, has, remove, toggle, items: state };
};
