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
      dispatch({ type: "SELL_ITEM" });
    });
  }
  if (
    upgrades.autoSell.level &&
    upgrades.autoSell.enabled &&
    player.action === "IDLE" &&
    player.location === "TOWN" &&
    allInventory.slots
  ) {
    delay("autoSell", () => {
      dispatch({ type: "SELL" });
    });
  }
  return false;
};
