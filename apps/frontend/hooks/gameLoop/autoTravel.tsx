import { Player } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTravel = {
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  player: Player;
  autoUpgrade: PurchasedUpgrade;
  upgrade: PurchasedUpgrade;
  allInventory: AllInventory;

  dispatch: Dispatch;
};
export const autoTravel = ({
  delta,
  upgrade,
  allInventory,
  player,
  autoUpgrade,
  lastTimes,
  setLastTime,
  dispatch,
}: AutoTravel) => {
  if (player.action === "TRAVELLING") {
    setLastTime("travel", lastTimes.travel + delta);
    if (lastTimes.travel > upgrade.time) {
      dispatch({ type: "ARRIVE" });
      setLastTime("travel", 0);
      return;
    }
  }

  if (!autoUpgrade.level || !autoUpgrade.enabled) {
    return;
  }

  if (
    player.location === "TOWN" &&
    player.action === "IDLE" &&
    allInventory.slots === 0
  ) {
    setLastTime("autoTravel", lastTimes.autoTravel + delta);
    if (lastTimes.autoTravel > autoUpgrade.time) {
      dispatch({ type: "TRAVEL", payload: { destination: "KILLING_FIELDS" } });
      setLastTime("autoTravel", 0);
      return;
    }
  } else if (
    player.location !== "TOWN" &&
    player.action === "IDLE" &&
    allInventory.full
  ) {
    setLastTime("autoTravel", lastTimes.autoTravel + delta);
    if (lastTimes.autoTravel > autoUpgrade.time) {
      dispatch({ type: "TRAVEL", payload: { destination: "TOWN" } });
      setLastTime("autoTravel", 0);
      return;
    }
  }
};
