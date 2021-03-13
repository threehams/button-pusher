import { PlayerAction, PlayerLocation } from "@botnet/messages";
import {
  Adventure,
  Sell,
  SellItem,
  AllInventory,
  PurchasedUpgrade,
} from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoSell = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  sell: Sell;
  adventure: Adventure;
  sellItem: SellItem;
  delta: number;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  allInventory: AllInventory;
};
export const autoSell = ({
  sell,
  sellItem,
  delta,
  upgrade,
  autoUpgrade,
  playerAction,
  playerLocation,
  allInventory,
  setLastTime,
  lastTimes,
}: AutoSell) => {
  if (playerAction === "SELLING") {
    setLastTime("sell", lastTimes.sell + delta);
    if (lastTimes.sell > upgrade.time) {
      sellItem();
      setLastTime("sell", 0);
      return;
    }
  }
  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE" &&
    playerLocation === "TOWN" &&
    allInventory.slots
  ) {
    setLastTime("autoSell", lastTimes.autoSell + delta);
    if (lastTimes.autoSell > autoUpgrade.time) {
      sell();
      setLastTime("autoSell", 0);
      return;
    }
  }
};
