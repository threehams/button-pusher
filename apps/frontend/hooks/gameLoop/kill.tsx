import { Item, PlayerAction, PlayerLocation, Slot } from "@botnet/messages";
import { Adventure, Loot, PurchasedUpgrade } from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type Kill = {
  heldSlot: (Slot & { item: Item }) | undefined;
  loot: Loot;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
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
  playerAction,
  upgrade,
  adventure,
  playerLocation,
  autoUpgrade,
  lastTimes,
  setLastTime,
}: Kill) => {
  if (heldSlot) {
    return;
  }

  if (playerAction === "KILLING") {
    setLastTime("kill", lastTimes.kill + delta);
    if (lastTimes.kill > upgrade.time) {
      loot();
      setLastTime("kill", 0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE" &&
    playerLocation !== "TOWN"
  ) {
    setLastTime("autoKill", lastTimes.autoKill + delta);
    if (lastTimes.autoKill > autoUpgrade.time) {
      adventure();
      setLastTime("autoKill", 0);
    }
  }
};
