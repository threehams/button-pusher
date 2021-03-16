import { Updater } from "./updateProps";

export const autoStore: Updater = ({
  upgrades,
  heldSlot,
  delay,
  player,
  allInventory,
  dispatch,
}) => {
  if (player.action === "STORING" && heldSlot) {
    delay("pack", () => {
      dispatch({ type: "STORE_HELD_ITEM" });
    });
  }

  if (
    !allInventory.full &&
    upgrades.autoPack.level &&
    upgrades.autoPack.enabled &&
    heldSlot
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_STORE" });
    } else if (player.action === "AUTO_STORING") {
      delay("autoPack", () => {
        dispatch({ type: "PACK" });
      });
    }
  }

  return false;
};
