import { Player } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoSell = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  player: Player;
  allInventory: AllInventory;
  dispatch: Dispatch;
};
export const autoSell = ({
  delta,
  upgrade,
  autoUpgrade,
  player,
  allInventory,
  setLastTime,
  lastTimes,
  dispatch,
}: AutoSell) => {
  if (player.action === "SELLING") {
    setLastTime("sell", lastTimes.sell + delta);
    if (lastTimes.sell > upgrade.time) {
      dispatch({ type: "SELL_ITEM" });
      setLastTime("sell", 0);
      return;
    }
  }
  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE" &&
    player.location === "TOWN" &&
    allInventory.slots
  ) {
    setLastTime("autoSell", lastTimes.autoSell + delta);
    if (lastTimes.autoSell > autoUpgrade.time) {
      dispatch({ type: "SELL" });
      setLastTime("autoSell", 0);
      return;
    }
  }
};
