import { Item, PlayerAction, PlayerLocation } from "@botnet/messages";
import { Adventure, Loot, PurchasedUpgrade } from "@botnet/store";
import { choice } from "./choice";

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
  autoUpgrade: PurchasedUpgrade;
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
  autoUpgrade,
}: Kill) => {
  if (heldItem) {
    return;
  }

  if (playerAction === "KILLING") {
    setLastKill(lastKill + delta);
    if (lastKill > upgrade.time) {
      loot({ itemId: choice(availableItems).id });
      setLastKill(0);
    }
  }

  if (
    autoUpgrade.level &&
    playerAction === "IDLE" &&
    playerLocation !== "TOWN"
  ) {
    setLastAutoKill(lastAutoKill + delta);
    if (lastAutoKill > autoUpgrade.time) {
      adventure();
      setLastAutoKill(0);
    }
  }
};
