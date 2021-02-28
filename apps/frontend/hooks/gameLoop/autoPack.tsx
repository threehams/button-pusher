import { Item, PlayerAction, PurchasedUpgrade } from "@botnet/messages";
import { Pack, StoreHeldItem } from "@botnet/store";

const PACK_INTERVAL = 500;
const AUTOPACK_INTERVAL = 1000;

type AutoPack = {
  upgrade: PurchasedUpgrade;
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
    if (lastPack > PACK_INTERVAL) {
      storeHeldItem();
      setLastPack(0);
    }
  }

  if (upgrade.level && heldItem && playerAction === "IDLE") {
    setLastAutoPack(lastAutoPack + delta);
    if (lastAutoPack > AUTOPACK_INTERVAL) {
      pack();
      setLastPack(0);
    }
  }
};
