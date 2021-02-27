import { Item, PurchasedUpgradeMap } from "@botnet/messages";
import { Pack, Sell, SetHeldItem, Sort } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useCallback, useRef } from "react";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { kill } from "./kill";

type UseGameLoop = {
  setHeldItem: SetHeldItem;
  heldItem: Item | undefined;
  availableItems: Item[];
  purchasedUpgradeMap: PurchasedUpgradeMap;
  pack: Pack;
  containerId: string;
  sort: Sort;
  sell: Sell;
  full: boolean;
};
export const useGameLoop = ({
  setHeldItem,
  heldItem,
  availableItems,
  purchasedUpgradeMap,
  pack,
  sort,
  sell,
  containerId,
  full,
}: UseGameLoop) => {
  const lastKill = useRef(0);
  const lastPack = useRef(0);
  const lastSort = useRef(0);
  const lastSell = useRef(0);

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
      autoSort({
        upgrade: purchasedUpgradeMap.AUTOMATE_SORT,
        sort,
        delta,
        lastSort,
        containerId,
      });
      autoSell({
        full,
        upgrade: purchasedUpgradeMap.AUTOMATE_SELL,
        sell,
        delta,
        lastSell,
      });
    },
    [
      availableItems,
      containerId,
      full,
      heldItem,
      pack,
      purchasedUpgradeMap.AUTOMATE_PACK,
      purchasedUpgradeMap.AUTOMATE_SELL,
      purchasedUpgradeMap.AUTOMATE_SORT,
      sell,
      setHeldItem,
      sort,
    ],
  );
  useLoop(loop);
};
