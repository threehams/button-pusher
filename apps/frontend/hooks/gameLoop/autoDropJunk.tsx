import { Updater } from "./updateProps";

export const autoDropJunk: Updater = ({
  delay,
  player,
  allInventory,
  dispatch,
  upgrades,
}) => {
  if (player.action === "DROPPING" && allInventory.junk) {
    delay("dropJunk", () => {
      dispatch({
        type: "DROP_JUNK_ITEM",
        payload: { playerLocation: player.location },
      });
    });
  }

  if (
    allInventory.junk &&
    upgrades.autoDropJunk.level &&
    upgrades.autoDropJunk.enabled
  ) {
    if (player.action === "IDLE") {
      dispatch({ type: "AUTO_DROP_JUNK" });
    } else if (player.action === "AUTO_DROPPING") {
      delay("autoDropJunk", () => {
        dispatch({ type: "DROP_JUNK" });
      });
    }
  }

  return false;
};
