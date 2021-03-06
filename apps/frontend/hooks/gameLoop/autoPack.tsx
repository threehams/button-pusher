import { Item, PlayerAction, Slot } from "@botnet/messages";
import {
  AllInventory,
  Pack,
  PurchasedUpgrade,
  StoreHeldItem,
} from "@botnet/store";

type AutoPack = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  heldSlot: (Slot & { item: Item }) | undefined;
  lastPack: number;
  setLastPack: (value: number) => void;
  lastAutoPack: number;
  setLastAutoPack: (value: number) => void;
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
  lastPack,
  setLastPack,
  pack,
  storeHeldItem,
  delta,
  playerAction,
  lastAutoPack,
  setLastAutoPack,
  allInventory,
}: AutoPack) => {
  if (playerAction === "STORING" && heldSlot) {
    setLastPack(lastPack + delta);
    if (lastPack > upgrade.time) {
      storeHeldItem();
      setLastPack(0);
    }
  }

  if (
    !allInventory.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    heldSlot &&
    playerAction === "IDLE"
  ) {
    setLastAutoPack(lastAutoPack + delta);
    if (lastAutoPack > autoUpgrade.time) {
      pack();
      setLastAutoPack(0);
    }
  }
};
