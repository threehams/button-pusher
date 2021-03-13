import { Item, PlayerAction, Slot } from "@botnet/messages";
import {
  AllInventory,
  Pack,
  PurchasedUpgrade,
  StoreHeldItem,
} from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoPack = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  heldSlot: (Slot & { item: Item }) | undefined;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  pack: Pack;
  storeHeldItem: StoreHeldItem;
  delta: number;
  playerAction: PlayerAction;
  allInventory: AllInventory;
};
export const autoPack = ({
  autoUpgrade,
  upgrade,
  heldSlot,
  lastTimes,
  setLastTime,
  pack,
  storeHeldItem,
  delta,
  playerAction,
  allInventory,
}: AutoPack) => {
  if (playerAction === "STORING" && heldSlot) {
    setLastTime("pack", lastTimes.pack + delta);
    if (lastTimes.pack > upgrade.time) {
      storeHeldItem();
      setLastTime("pack", 0);
    }
  }

  if (
    !allInventory.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    heldSlot &&
    playerAction === "IDLE"
  ) {
    setLastTime("autoPack", lastTimes.autoPack + delta);
    if (lastTimes.autoPack > autoUpgrade.time) {
      pack();
      setLastTime("autoPack", 0);
    }
  }
};
