import {
  PlayerAction,
  PlayerLocation,
  PurchasedUpgrade,
} from "@botnet/messages";
import { Adventure, Sell, SellItem, Inventory } from "@botnet/store";

const SELL_INTERVAL = 2000;
const SELL_ITEM_INTERVAL = 1000;

type AutoSell = {
  upgrade: PurchasedUpgrade;
  lastSell: number;
  setLastSell: (value: number) => void;
  lastSellItem: number;
  setLastSellItem: (value: number) => void;
  sell: Sell;
  adventure: Adventure;
  sellItem: SellItem;
  delta: number;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  inventory: Inventory;
};
export const autoSell = ({
  lastSell,
  lastSellItem,
  setLastSell,
  setLastSellItem,
  sell,
  sellItem,
  delta,
  upgrade,
  playerAction,
  playerLocation,
  inventory,
}: AutoSell) => {
  if (!upgrade.level) {
    return;
  }
  if (
    playerLocation === "TOWN" &&
    playerAction === "IDLE" &&
    inventory.slots.length
  ) {
    setLastSell(lastSell + delta);
    if (lastSell > SELL_INTERVAL) {
      sell();
      return;
    }
  }
  if (playerAction === "SELLING") {
    setLastSellItem(lastSellItem + delta);
    if (lastSellItem > SELL_ITEM_INTERVAL) {
      sellItem();
      setLastSellItem(0);
      return;
    }
  }
  if (
    playerAction === "IDLE" &&
    playerLocation === "TOWN" &&
    inventory.slots.length
  ) {
    sell();
  }
};
