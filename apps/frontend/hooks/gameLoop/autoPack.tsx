import { Updater } from "./updateProps";

export const autoPack: Updater = ({
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
    heldSlot &&
    player.action === "IDLE"
  ) {
    delay("autoPack", () => {
      dispatch({ type: "PACK" });
    });
  }

  return false;
};
