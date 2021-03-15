import { UpdateProps } from "./updateProps";

export const autoTrash = ({
  autoUpgrade,
  upgrade,
  delta,
  player,
  floor,
  lastTimes,
  setLastTime,
  dispatch,
}: UpdateProps) => {
  if (player.action === "TRASHING") {
    setLastTime("trash", lastTimes.trash + delta);
    if (lastTimes.trash > upgrade.time) {
      dispatch({
        type: "TRASH_ALL",
        payload: { playerLocation: player.location },
      });
      setLastTime("trash", 0);
    }
  }

  if (
    floor.allJunk &&
    floor.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE"
  ) {
    setLastTime("autoTrash", lastTimes.autoTrash + delta);
    if (lastTimes.autoTrash > autoUpgrade.time) {
      dispatch({ type: "TRASH" });
      setLastTime("autoTrash", 0);
    }
  }
};
