import { Item, PlayerAction, Slot } from "@botnet/messages";
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
  playerAction: PlayerAction;
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
  playerAction,
  allInventory,
  dispatch,
}: AutoPack) => {
  if (playerAction === "STORING" && heldSlot) {
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
    playerAction === "IDLE"
  ) {
    setLastTime("autoPack", lastTimes.autoPack + delta);
    if (lastTimes.autoPack > autoUpgrade.time) {
      dispatch({ type: "PACK" });
      setLastTime("autoPack", 0);
    }
  }
};
