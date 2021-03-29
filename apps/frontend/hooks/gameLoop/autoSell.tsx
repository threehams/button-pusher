import { Updater } from "./updateProps";

export const autoSell: Updater = ({
  delay,
  upgrades,
  player,
  allInventory,
  dispatch,
  playerId,
}) => {
  if (player.action === "SELLING") {
    delay("sell", () => {
      dispatch({ type: "SELL_ITEM", payload: { playerId } });
    });
  }
  if (
    upgrades.autoSell.level &&
    upgrades.autoSell.enabled &&
    player.location === "TOWN" &&
    allInventory.slots > 0
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_SELL", payload: { playerId } });
    } else if (player.action === "AUTO_SELLING") {
      delay("autoSell", () => {
        dispatch({ type: "SELL", payload: { playerId } });
      });
    }
  }
  return false;
};
