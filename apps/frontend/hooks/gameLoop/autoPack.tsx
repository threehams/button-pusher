import { UpdateProps } from "./updateProps";

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
}: UpdateProps) => {
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
