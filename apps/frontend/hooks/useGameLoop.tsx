import { Item, PurchasedUpgradeMap } from "@botnet/messages";
import { SetHeldItem } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useCallback, useRef } from "react";
import { alea } from "seedrandom";

const random = alea();
const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(random() * arr.length)];
};

type Kill = {
  heldItem: Item | undefined;
  setHeldItem: SetHeldItem;
  lastItem: React.MutableRefObject<number>;
  availableItems: Item[];
  delta: number;
};
const kill = ({
  availableItems,
  delta,
  heldItem,
  setHeldItem,
  lastItem,
}: Kill) => {
  if (heldItem) {
    return;
  }
  lastItem.current = lastItem.current + delta;
  if (lastItem.current > 500) {
    setHeldItem(choice(availableItems).id);
    lastItem.current = 0;
  }
};

type UseGameLoop = {
  setHeldItem: SetHeldItem;
  heldItem: Item | undefined;
  availableItems: Item[];
  purchasedUpgradeMap: PurchasedUpgradeMap;
};
export const useGameLoop = ({
  setHeldItem,
  heldItem,
  availableItems,
}: UseGameLoop) => {
  const lastItem = useRef(0);
  const loop = useCallback(
    (delta: number) => {
      kill({
        heldItem,
        setHeldItem,
        lastItem,
        delta,
        availableItems,
      });
    },
    [availableItems, heldItem, setHeldItem],
  );
  useLoop(loop);
};
