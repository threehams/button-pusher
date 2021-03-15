import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { PurchasedUpgrade, Inventory } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTrash = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  delta: number;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  floor: Inventory;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  dispatch: Dispatch;
};
export const autoTrash = ({
  autoUpgrade,
  upgrade,
  delta,
  playerAction,
  floor,
  lastTimes,
  setLastTime,
  dispatch,
  playerLocation,
}: AutoTrash) => {
  if (playerAction === "TRASHING") {
    setLastTime("trash", lastTimes.trash + delta);
    if (lastTimes.trash > upgrade.time) {
      dispatch({ type: "TRASH_ALL", payload: { playerLocation } });
      setLastTime("trash", 0);
    }
  }

  if (
    floor.allJunk &&
    floor.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE"
  ) {
    setLastTime("autoTrash", lastTimes.autoTrash + delta);
    if (lastTimes.autoTrash > autoUpgrade.time) {
      dispatch({ type: "TRASH" });
      setLastTime("autoTrash", 0);
    }
  }
};
