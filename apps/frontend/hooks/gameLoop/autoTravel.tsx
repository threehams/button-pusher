import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { Arrive, AllInventory, PurchasedUpgrade, Travel } from "@botnet/store";

type AutoTravel = {
  lastTravel: number;
  setLastTravel: (value: number) => void;
  lastAutoTravel: number;
  setLastAutoTravel: (value: number) => void;
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
  lastTravel,
  delta,
  setLastTravel,
  arrive,
  upgrade,
  allInventory,
  travel,
  playerLocation,
  lastAutoTravel,
  setLastAutoTravel,
  autoUpgrade,
}: AutoTravel) => {
  if (playerAction === "TRAVELLING") {
    setLastTravel(lastTravel + delta);
    if (lastTravel > upgrade.time) {
      arrive();
      setLastTravel(0);
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
    setLastAutoTravel(lastAutoTravel + delta);
    if (lastAutoTravel > autoUpgrade.time) {
      travel({ destination: "KILLING_FIELDS" });
      setLastAutoTravel(0);
      return;
    }
  } else if (
    playerLocation !== "TOWN" &&
    playerAction === "IDLE" &&
    allInventory.full
  ) {
    setLastAutoTravel(lastAutoTravel + delta);
    if (lastAutoTravel > autoUpgrade.time) {
      travel({ destination: "TOWN" });
      setLastAutoTravel(0);
      return;
    }
  }
};
