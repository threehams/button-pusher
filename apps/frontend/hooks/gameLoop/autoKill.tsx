import { Updater } from "./updateProps";

export const autoKill: Updater = ({
  heldSlot,
  dispatch,
  player,
  upgrades,
  delay,
}) => {
  if (heldSlot) {
    return false;
  }

  if (player.action === "KILLING") {
    delay("kill", () => {
      dispatch({ type: "LOOT" });
    });
  }

  if (
    upgrades.autoKill.level &&
    upgrades.autoKill.enabled &&
    player.location !== "TOWN"
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_KILL" });
    } else if (player.action === "AUTO_KILLING") {
      delay("autoKill", () => {
        dispatch({ type: "ADVENTURE" });
      });
    }
  }

  return false;
};
