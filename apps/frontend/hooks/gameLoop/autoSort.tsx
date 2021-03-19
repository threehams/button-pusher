import { Updater } from "./updateProps";

export const autoSort: Updater = ({
  upgrades,
  inventory,
  dispatch,
  delay,
  player,
  playerId,
}) => {
  if (player.action === "SORTING") {
    delay("sort", () => {
      dispatch({ type: "SORT", payload: { playerId } });
    });
  }

  if (
    upgrades.autoSort.level &&
    upgrades.autoSort.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_SORT", payload: { playerId } });
    } else if (player.action === "AUTO_SORTING") {
      delay("autoSort", () => {
        dispatch({ type: "START_SORT", payload: { playerId } });
      });
    }
  }
  return false;
};
