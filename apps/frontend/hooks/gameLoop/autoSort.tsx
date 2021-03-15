import { Updater } from "./updateProps";

export const autoSort: Updater = ({
  upgrades,
  inventory,
  dispatch,
  delay,
  player,
}) => {
  if (player.action === "SORTING") {
    delay("sort", () => {
      dispatch({ type: "SORT" });
    });
  }

  if (
    upgrades.autoSort.level &&
    upgrades.autoSort.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    delay("autoSort", () => {
      dispatch({ type: "START_SORT" });
    });
  }
  return false;
};
