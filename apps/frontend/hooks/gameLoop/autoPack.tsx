import { Item, PlayerAction } from "@botnet/messages";
import {
  AllInventory,
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
  allInventory: AllInventory;
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
  allInventory,
}: AutoPack) => {
  if (playerAction === "STORING" && heldItem) {
    setLastPack(lastPack + delta);
    if (lastPack > upgrade.time) {
      storeHeldItem();
      setLastPack(0);
    }
  }

  if (
    !allInventory.full &&
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
