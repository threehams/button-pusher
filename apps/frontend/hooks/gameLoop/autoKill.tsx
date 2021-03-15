import { UpdateProps } from "./updateProps";

export const autoKill = ({
  delta,
  heldSlot,
  player,
  upgrade,
  autoUpgrade,
  lastTimes,
  setLastTime,
  dispatch,
}: UpdateProps) => {
  if (heldSlot) {
    return;
  }

  if (player.action === "KILLING") {
    setLastTime("kill", lastTimes.kill + delta);
    if (lastTimes.kill > upgrade.time) {
      dispatch({ type: "LOOT" });
      setLastTime("kill", 0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE" &&
    player.location !== "TOWN"
  ) {
    setLastTime("autoKill", lastTimes.autoKill + delta);
    if (lastTimes.autoKill > autoUpgrade.time) {
      dispatch({ type: "ADVENTURE" });
      setLastTime("autoKill", 0);
    }
  }
};
