import { Item, Player, Slot } from "@botnet/messages";
import { PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type Kill = {
  heldSlot: (Slot & { item: Item }) | undefined;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;

  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  player: Player;

  dispatch: Dispatch;
};
export const autoKill = ({
  delta,
  heldSlot,
  player,
  upgrade,

  autoUpgrade,
  lastTimes,
  setLastTime,
  dispatch,
}: Kill) => {
  if (heldSlot) {
    return;
  }

  if (player.action === "KILLING") {
    setLastTime("kill", lastTimes.kill + delta);
    if (lastTimes.kill > upgrade.time) {
      dispatch({ type: "LOOT" });
      setLastTime("kill", 0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE" &&
    player.location !== "TOWN"
  ) {
    setLastTime("autoKill", lastTimes.autoKill + delta);
    if (lastTimes.autoKill > autoUpgrade.time) {
      dispatch({ type: "ADVENTURE" });
      setLastTime("autoKill", 0);
    }
  }
};
