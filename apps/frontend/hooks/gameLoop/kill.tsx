import { Item, PlayerAction, PlayerLocation, Slot } from "@botnet/messages";
import { Adventure, Loot, PurchasedUpgrade } from "@botnet/store";

type Kill = {
  heldSlot: (Slot & { item: Item }) | undefined;
  loot: Loot;
  lastKill: number;
  setLastKill: (value: number) => void;
  lastAutoKill: number;
  setLastAutoKill: (value: number) => void;
  delta: number;
  playerAction: PlayerAction;
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  playerLocation: PlayerLocation;
  adventure: Adventure;
};
export const kill = ({
  delta,
  heldSlot,
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
  if (heldSlot) {
    return;
  }

  if (playerAction === "KILLING") {
    setLastKill(lastKill + delta);
    if (lastKill > upgrade.time) {
      loot();
      setLastKill(0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
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
