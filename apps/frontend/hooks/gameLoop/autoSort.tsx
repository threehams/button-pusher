import { Player } from "@botnet/messages";
import { Inventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoSort = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  inventory: Inventory;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  delta: number;
  player: Player;
  dispatch: Dispatch;
};
export const autoSort = ({
  upgrade,
  inventory,
  dispatch,
  delta,
  autoUpgrade,
  player,
  lastTimes,
  setLastTime,
}: AutoSort) => {
  if (player.action === "SORTING") {
    setLastTime("sort", lastTimes.sort + delta);
    if (lastTimes.sort > upgrade.time) {
      dispatch({ type: "SORT" });
      setLastTime("sort", 0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    setLastTime("autoSort", lastTimes.autoSort + delta);
    if (lastTimes.autoSort > autoUpgrade.time) {
      dispatch({ type: "START_SORT" });
      setLastTime("autoSort", 0);
    }
  }
};
