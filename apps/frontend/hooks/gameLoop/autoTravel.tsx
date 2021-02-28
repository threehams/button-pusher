import {
  PlayerAction,
  PlayerLocation,
  PurchasedUpgrade,
} from "@botnet/messages";
import { Arrive, Inventory, Travel } from "@botnet/store";

const TRAVEL_INTERVAL = 2000;

type AutoTravel = {
  lastTravel: number;
  setLastTravel: (value: number) => void;
  arrive: Arrive;
  delta: number;
  playerAction: PlayerAction;
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
}: AutoTravel) => {
  if (playerAction === "TRAVELLING") {
    setLastTravel(lastTravel + delta);
    if (lastTravel > TRAVEL_INTERVAL) {
      arrive();
      setLastTravel(0);
      return;
    }
  }

  if (!upgrade.level) {
    return;
  }

  if (
    playerLocation === "TOWN" &&
    playerAction === "IDLE" &&
    inventory.slots.length === 0
  ) {
    travel({ destination: "KILLING_FIELDS" });
  }

  if (playerLocation !== "TOWN" && playerAction === "IDLE" && inventory.full) {
    travel({ destination: "TOWN" });
  }
};
