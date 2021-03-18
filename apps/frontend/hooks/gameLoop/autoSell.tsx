import { Updater } from "./updateProps";

export const autoSell: Updater = ({
  delay,
  upgrades,
  player,
  allInventory,
  dispatch,
}) => {
  if (player.action === "SELLING") {
    delay("sell", () => {
      dispatch({ type: "SELL_ITEM", payload: { playerId: player.id } });
    });
  }
  if (
    upgrades.autoSell.level &&
    upgrades.autoSell.enabled &&
    player.location === "TOWN" &&
    allInventory.slots
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_SELL", payload: { playerId: player.id } });
    } else if (player.action === "AUTO_SELLING") {
      delay("autoSell", () => {
        dispatch({ type: "SELL", payload: { playerId: player.id } });
      });
    }
  }
  return false;
};
