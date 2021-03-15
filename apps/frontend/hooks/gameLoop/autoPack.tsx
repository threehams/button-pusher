import { Item, Player, Slot } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoPack = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  heldSlot: (Slot & { item: Item }) | undefined;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  player: Player;
  allInventory: AllInventory;
  dispatch: Dispatch;
};
export const autoPack = ({
  autoUpgrade,
  upgrade,
  heldSlot,
  lastTimes,
  setLastTime,
  delta,
  player,
  allInventory,
  dispatch,
}: AutoPack) => {
  if (player.action === "STORING" && heldSlot) {
    setLastTime("pack", lastTimes.pack + delta);
    if (lastTimes.pack > upgrade.time) {
      dispatch({ type: "STORE_HELD_ITEM" });
      setLastTime("pack", 0);
    }
  }

  if (
    !allInventory.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    heldSlot &&
    player.action === "IDLE"
  ) {
    setLastTime("autoPack", lastTimes.autoPack + delta);
    if (lastTimes.autoPack > autoUpgrade.time) {
      dispatch({ type: "PACK" });
      setLastTime("autoPack", 0);
    }
  }
};
