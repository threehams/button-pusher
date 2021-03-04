import { PlayerAction, PlayerLocation } from "@botnet/messages";
import {
  Adventure,
  Sell,
  SellItem,
  AllInventory,
  PurchasedUpgrade,
} from "@botnet/store";

type AutoSell = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastAutoSell: number;
  setLastAutoSell: (value: number) => void;
  lastSell: number;
  setLastSell: (value: number) => void;
  sell: Sell;
  adventure: Adventure;
  sellItem: SellItem;
  delta: number;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  allInventory: AllInventory;
};
export const autoSell = ({
  lastAutoSell: lastAutoSell,
  lastSell: lastSell,
  setLastAutoSell,
  setLastSell,
  sell,
  sellItem,
  delta,
  upgrade,
  autoUpgrade,
  playerAction,
  playerLocation,
  allInventory,
}: AutoSell) => {
  if (playerAction === "SELLING") {
    setLastSell(lastSell + delta);
    if (lastSell > upgrade.time) {
      sellItem();
      setLastSell(0);
      return;
    }
  }
  if (
    autoUpgrade.level &&
    playerAction === "IDLE" &&
    playerLocation === "TOWN" &&
    allInventory.slots
  ) {
    setLastAutoSell(lastAutoSell + delta);
    if (lastAutoSell > autoUpgrade.time) {
      sell();
      setLastAutoSell(0);
      return;
    }
  }
};
