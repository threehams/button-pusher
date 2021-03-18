import { Updater } from "./updateProps";

export const autoTrash: Updater = ({
  upgrades,
  delay,
  player,
  floor,
  dispatch,
}) => {
  if (player.action === "TRASHING") {
    delay("trash", () => {
      dispatch({
        type: "TRASH_ALL",
        payload: { playerLocation: player.location, playerId: player.id },
      });
    });
  }

  if (
    floor.allJunk &&
    floor.full &&
    upgrades.autoTrash.level &&
    upgrades.autoTrash.enabled
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_TRASH", payload: { playerId: player.id } });
    } else if (player.action === "AUTO_TRASHING") {
      delay("autoTrash", () => {
        dispatch({ type: "TRASH", payload: { playerId: player.id } });
      });
    }
  }
  return false;
};
