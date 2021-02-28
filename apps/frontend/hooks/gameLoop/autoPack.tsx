import { Item, PlayerAction } from "@botnet/messages";
import { Pack, PurchasedUpgrade, StoreHeldItem } from "@botnet/store";

// const PACK_INTERVAL = 500;
// const AUTOPACK_INTERVAL = 1000;

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
}: AutoPack) => {
  if (playerAction === "STORING" && heldItem) {
    setLastPack(lastPack + delta);
    if (lastPack > upgrade.time) {
      storeHeldItem();
      setLastPack(0);
    }
  }

  if (autoUpgrade.level && heldItem && playerAction === "IDLE") {
    setLastAutoPack(lastAutoPack + delta);
    if (lastAutoPack > autoUpgrade.time) {
      pack();
      setLastPack(0);
    }
  }
};
