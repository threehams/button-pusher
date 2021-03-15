import { Updater } from "./updateProps";

export const autoTravel: Updater = ({
  delay,
  upgrades,
  allInventory,
  player,
  dispatch,
}) => {
  if (player.action === "TRAVELLING") {
    delay("travel", () => {
      dispatch({ type: "ARRIVE" });
    });
  }

  if (!upgrades.autoTravel.level || !upgrades.autoTravel.enabled) {
    return false;
  }

  if (
    player.location === "TOWN" &&
    player.action === "IDLE" &&
    allInventory.slots === 0
  ) {
    delay("autoTravel", () => {
      dispatch({ type: "TRAVEL", payload: { destination: "KILLING_FIELDS" } });
    });
  } else if (
    player.location !== "TOWN" &&
    player.action === "IDLE" &&
    allInventory.full
  ) {
    delay("autoTravel", () => {
      dispatch({ type: "TRAVEL", payload: { destination: "TOWN" } });
    });
  }
  return false;
};
