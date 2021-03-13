import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { Arrive, AllInventory, PurchasedUpgrade, Travel } from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTravel = {
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  arrive: Arrive;
  delta: number;
  playerAction: PlayerAction;
  autoUpgrade: PurchasedUpgrade;
  upgrade: PurchasedUpgrade;
  allInventory: AllInventory;
  travel: Travel;
  playerLocation: PlayerLocation;
};
export const autoTravel = ({
  playerAction,
  delta,
  arrive,
  upgrade,
  allInventory,
  travel,
  playerLocation,
  autoUpgrade,
  lastTimes,
  setLastTime,
}: AutoTravel) => {
  if (playerAction === "TRAVELLING") {
    setLastTime("travel", lastTimes.travel + delta);
    if (lastTimes.travel > upgrade.time) {
      arrive();
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
      travel({ destination: "KILLING_FIELDS" });
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
      travel({ destination: "TOWN" });
      setLastTime("autoTravel", 0);
      return;
    }
  }
};
