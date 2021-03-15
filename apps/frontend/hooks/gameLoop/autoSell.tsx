import { UpdateProps } from "./updateProps";

export const autoSell = ({
  delta,
  upgrade,
  autoUpgrade,
  player,
  allInventory,
  setLastTime,
  lastTimes,
  dispatch,
}: UpdateProps) => {
  if (player.action === "SELLING") {
    setLastTime("sell", lastTimes.sell + delta);
    if (lastTimes.sell > upgrade.time) {
      dispatch({ type: "SELL_ITEM" });
      setLastTime("sell", 0);
      return;
    }
  }
  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE" &&
    player.location === "TOWN" &&
    allInventory.slots
  ) {
    setLastTime("autoSell", lastTimes.autoSell + delta);
    if (lastTimes.autoSell > autoUpgrade.time) {
      dispatch({ type: "SELL" });
      setLastTime("autoSell", 0);
      return;
    }
  }
};
