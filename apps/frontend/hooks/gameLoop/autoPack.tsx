import { Item, PlayerAction } from "@botnet/messages";
import {
  Inventory,
  Pack,
  PurchasedUpgrade,
  StoreHeldItem,
} from "@botnet/store";

type AutoPack = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  heldItem: Item | undefined;
  lastPack: number;
  setLastPack: (value: number) => void;
  lastAutoPack: number;
  setLastAutoPack: (value: number) => void;
  pack: Pack;
  storeHeldItem: StoreHeldItem;
  delta: number;
  playerAction: PlayerAction;
  inventory: Inventory;
};
export const autoPack = ({
  autoUpgrade,
  upgrade,
  heldItem,
  lastPack,
  setLastPack,
  pack,
  storeHeldItem,
  delta,
  playerAction,
  lastAutoPack,
  setLastAutoPack,
  inventory,
}: AutoPack) => {
  if (playerAction === "STORING" && heldItem) {
    setLastPack(lastPack + delta);
    if (lastPack > upgrade.time) {
      storeHeldItem();
      setLastPack(0);
    }
  }

  if (
    !inventory.full &&
    autoUpgrade.level &&
    heldItem &&
    playerAction === "IDLE"
  ) {
    setLastAutoPack(lastAutoPack + delta);
    if (lastAutoPack > autoUpgrade.time) {
      pack();
      setLastAutoPack(0);
    }
  }
};
