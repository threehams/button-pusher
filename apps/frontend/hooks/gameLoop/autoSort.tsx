import { UpdateProps } from "./updateProps";

export const autoSort = ({
  upgrade,
  inventory,
  dispatch,
  delta,
  autoUpgrade,
  player,
  lastTimes,
  setLastTime,
}: UpdateProps) => {
  if (player.action === "SORTING") {
    setLastTime("sort", lastTimes.sort + delta);
    if (lastTimes.sort > upgrade.time) {
      dispatch({ type: "SORT" });
      setLastTime("sort", 0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    setLastTime("autoSort", lastTimes.autoSort + delta);
    if (lastTimes.autoSort > autoUpgrade.time) {
      dispatch({ type: "START_SORT" });
      setLastTime("autoSort", 0);
    }
  }
};
