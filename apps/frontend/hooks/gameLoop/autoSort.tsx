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
      dispatch({ type: "SORT", payload: { playerId: player.id } });
    });
  }

  if (
    upgrades.autoSort.level &&
    upgrades.autoSort.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_SORT", payload: { playerId: player.id } });
    } else if (player.action === "AUTO_SORTING") {
      delay("autoSort", () => {
        dispatch({ type: "START_SORT", payload: { playerId: player.id } });
      });
    }
  }
  return false;
};
