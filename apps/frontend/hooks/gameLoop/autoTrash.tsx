import { Player } from "@botnet/messages";
import { Inventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTrash = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  delta: number;
  player: Player;
  floor: Inventory;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  dispatch: Dispatch;
};
export const autoTrash = ({
  autoUpgrade,
  upgrade,
  delta,
  player,
  floor,
  lastTimes,
  setLastTime,
  dispatch,
}: AutoTrash) => {
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
