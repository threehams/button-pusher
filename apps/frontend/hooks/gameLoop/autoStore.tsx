import { Updater } from "./updateProps";

export const autoStore: Updater = ({
  upgrades,
  heldSlot,
  delay,
  player,
  allInventory,
  dispatch,
  playerId,
}) => {
  if (player.action === "STORING" && heldSlot) {
    delay("pack", () => {
      dispatch({ type: "STORE_HELD_ITEM", payload: { playerId } });
    });
  }

  if (
    !allInventory.full &&
    upgrades.autoPack.level &&
    upgrades.autoPack.enabled &&
    heldSlot
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_STORE", payload: { playerId } });
    } else if (player.action === "AUTO_STORING") {
      delay("autoPack", () => {
        dispatch({ type: "PACK", payload: { playerId } });
      });
    }
  }

  return false;
};
