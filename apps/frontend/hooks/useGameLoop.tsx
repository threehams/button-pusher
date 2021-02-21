import { Item } from "@botnet/messages";
import { SetHeldItem } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useCallback, useRef } from "react";

type UseGameLoop = {
  setHeldItem: SetHeldItem;
  heldItem: Item | undefined;
  items: Item[];
};
export const useGameLoop = ({ setHeldItem, heldItem, items }: UseGameLoop) => {
  const lastItem = useRef(0);
  const doStuff = useCallback(
    (delta: number) => {
      lastItem.current = lastItem.current + delta;
      if (lastItem.current > 3000 && !heldItem) {
        setHeldItem(Object.values(items)[0].id);
      }
    },
    [heldItem, items, setHeldItem],
  );
  useLoop(doStuff);
};
