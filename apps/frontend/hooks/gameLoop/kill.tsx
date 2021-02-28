import {
  Item,
  PlayerAction,
  PlayerLocation,
  PurchasedUpgrade,
} from "@botnet/messages";
import { Adventure, Loot } from "@botnet/store";
import { alea } from "seedrandom";

const random = alea();
const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(random() * arr.length)];
};

const KILL_INTERVAL = 1000;
const AUTOKILL_INTERVAL = 1000;

type Kill = {
  heldItem: Item | undefined;
  loot: Loot;
  lastKill: number;
  setLastKill: (value: number) => void;
  lastAutoKill: number;
  setLastAutoKill: (value: number) => void;
  availableItems: Item[];
  delta: number;
  playerAction: PlayerAction;
  upgrade: PurchasedUpgrade;
  playerLocation: PlayerLocation;
  adventure: Adventure;
};
export const kill = ({
  availableItems,
  delta,
  heldItem,
  loot,
  lastKill,
  playerAction,
  setLastKill,
  lastAutoKill,
  setLastAutoKill,
  upgrade,
  adventure,
  playerLocation,
}: Kill) => {
  if (heldItem) {
    return;
  }

  if (playerAction === "KILLING") {
    setLastKill(lastKill + delta);
    if (lastKill > KILL_INTERVAL) {
      loot({ itemId: choice(availableItems).id });
      setLastKill(0);
    }
  }

  if (upgrade.level && playerAction === "IDLE" && playerLocation !== "TOWN") {
    setLastAutoKill(lastAutoKill + delta);
    if (lastAutoKill > AUTOKILL_INTERVAL) {
      adventure();
      setLastAutoKill(0);
    }
  }
};
