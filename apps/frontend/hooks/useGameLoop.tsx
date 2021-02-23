import { Item, PurchasedUpgrade, PurchasedUpgradeMap } from "@botnet/messages";
import { Pack, SetHeldItem } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useCallback, useRef } from "react";
import { alea } from "seedrandom";

const random = alea();
const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(random() * arr.length)];
};

const KILL_INTERVAL = 500;
const PACK_INTERVAL = 500;

type Kill = {
  heldItem: Item | undefined;
  setHeldItem: SetHeldItem;
  lastKill: React.MutableRefObject<number>;
  availableItems: Item[];
  delta: number;
};
const kill = ({
  availableItems,
  delta,
  heldItem,
  setHeldItem,
  lastKill,
}: Kill) => {
  if (heldItem) {
    return;
  }
  lastKill.current = lastKill.current + delta;
  if (lastKill.current > KILL_INTERVAL) {
    setHeldItem(choice(availableItems).id);
    lastKill.current = 0;
  }
};

type AutoPack = {
  upgrade: PurchasedUpgrade;
  heldItem: Item | undefined;
  lastPack: React.MutableRefObject<number>;
  pack: Pack;
  delta: number;
};
const autoPack = ({ upgrade, heldItem, lastPack, pack, delta }: AutoPack) => {
  if (!upgrade.level || !heldItem) {
    return;
  }
  lastPack.current = lastPack.current + delta;
  if (lastPack.current > PACK_INTERVAL) {
    pack({ itemId: heldItem.id });
    lastPack.current = 0;
  }
};

type UseGameLoop = {
  setHeldItem: SetHeldItem;
  heldItem: Item | undefined;
  availableItems: Item[];
  purchasedUpgradeMap: PurchasedUpgradeMap;
  pack: Pack;
};
export const useGameLoop = ({
  setHeldItem,
  heldItem,
  availableItems,
  purchasedUpgradeMap,
  pack,
}: UseGameLoop) => {
  const lastKill = useRef(0);
  const lastPack = useRef(0);

  const loop = useCallback(
    (delta: number) => {
      kill({
        heldItem,
        setHeldItem,
        lastKill,
        delta,
        availableItems,
      });
      autoPack({
        upgrade: purchasedUpgradeMap.AUTOMATE_PACK,
        pack,
        heldItem,
        delta,
        lastPack,
      });
    },
    [
      availableItems,
      heldItem,
      pack,
      purchasedUpgradeMap.AUTOMATE_PACK,
      setHeldItem,
    ],
  );
  useLoop(loop);
};
