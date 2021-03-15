import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTravel = {
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  playerAction: PlayerAction;
  autoUpgrade: PurchasedUpgrade;
  upgrade: PurchasedUpgrade;
  allInventory: AllInventory;
  playerLocation: PlayerLocation;
  dispatch: Dispatch;
};
export const autoTravel = ({
  playerAction,
  delta,
  upgrade,
  allInventory,
  playerLocation,
  autoUpgrade,
  lastTimes,
  setLastTime,
  dispatch,
}: AutoTravel) => {
  if (playerAction === "TRAVELLING") {
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
    playerLocation === "TOWN" &&
    playerAction === "IDLE" &&
    allInventory.slots === 0
  ) {
    setLastTime("autoTravel", lastTimes.autoTravel + delta);
    if (lastTimes.autoTravel > autoUpgrade.time) {
      dispatch({ type: "TRAVEL", payload: { destination: "KILLING_FIELDS" } });
      setLastTime("autoTravel", 0);
      return;
    }
  } else if (
    playerLocation !== "TOWN" &&
    playerAction === "IDLE" &&
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
