import { UpdateProps } from "./updateProps";

export const autoDropJunk = ({
  autoUpgrade,
  upgrade,
  delta,
  player,
  allInventory,
  dispatch,
  lastTimes,
  setLastTime,
}: UpdateProps) => {
  if (player.action === "DROPPING" && allInventory.junk) {
    setLastTime("dropJunk", lastTimes.dropJunk + delta);
    if (lastTimes.dropJunk > upgrade.time) {
      dispatch({
        type: "DROP_JUNK_ITEM",
        payload: { playerLocation: player.location },
      });
      setLastTime("dropJunk", 0);
    }
  }

  if (
    allInventory.junk &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE"
  ) {
    setLastTime("autoDropJunk", lastTimes.autoDropJunk + delta);
    if (lastTimes.autoDropJunk > autoUpgrade.time) {
      dispatch({ type: "DROP_JUNK" });
      setLastTime("autoDropJunk", 0);
    }
  }
};
