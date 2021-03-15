import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoSell = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  allInventory: AllInventory;
  dispatch: Dispatch;
};
export const autoSell = ({
  delta,
  upgrade,
  autoUpgrade,
  playerAction,
  playerLocation,
  allInventory,
  setLastTime,
  lastTimes,
  dispatch,
}: AutoSell) => {
  if (playerAction === "SELLING") {
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
    playerAction === "IDLE" &&
    playerLocation === "TOWN" &&
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
