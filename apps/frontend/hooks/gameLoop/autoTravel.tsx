import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { Arrive, Inventory, PurchasedUpgrade, Travel } from "@botnet/store";

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
  inventory: Inventory;
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
  inventory,
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

  if (!autoUpgrade.level) {
    return;
  }

  if (
    playerLocation === "TOWN" &&
    playerAction === "IDLE" &&
    inventory.slots.length === 0
  ) {
    setLastTravel(lastAutoTravel + delta);
    if (lastAutoTravel > autoUpgrade.time) {
      travel({ destination: "KILLING_FIELDS" });
      setLastAutoTravel(0);
      return;
    }
  }

  if (playerLocation !== "TOWN" && playerAction === "IDLE" && inventory.full) {
    setLastTravel(lastAutoTravel + delta);
    if (lastAutoTravel > autoUpgrade.time) {
      travel({ destination: "TOWN" });
      setLastAutoTravel(0);
      return;
    }
  }
};
