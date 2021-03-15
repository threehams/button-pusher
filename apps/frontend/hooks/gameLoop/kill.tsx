import { Item, PlayerAction, PlayerLocation, Slot } from "@botnet/messages";
import { PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type Kill = {
  heldSlot: (Slot & { item: Item }) | undefined;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  playerAction: PlayerAction;
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  playerLocation: PlayerLocation;
  dispatch: Dispatch;
};
export const kill = ({
  delta,
  heldSlot,
  playerAction,
  upgrade,
  playerLocation,
  autoUpgrade,
  lastTimes,
  setLastTime,
  dispatch,
}: Kill) => {
  if (heldSlot) {
    return;
  }

  if (playerAction === "KILLING") {
    setLastTime("kill", lastTimes.kill + delta);
    if (lastTimes.kill > upgrade.time) {
      dispatch({ type: "LOOT" });
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
      dispatch({ type: "ADVENTURE" });
      setLastTime("autoKill", 0);
    }
  }
};
