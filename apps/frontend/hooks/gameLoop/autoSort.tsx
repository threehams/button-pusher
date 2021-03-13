import { PlayerAction } from "@botnet/messages";
import { Inventory, PurchasedUpgrade, Sort, StartSort } from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoSort = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  inventory: Inventory;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  startSort: StartSort;
  sort: Sort;
  delta: number;
  playerAction: PlayerAction;
};
export const autoSort = ({
  upgrade,
  inventory,
  startSort,
  sort,
  delta,
  autoUpgrade,
  playerAction,
  lastTimes,
  setLastTime,
}: AutoSort) => {
  if (playerAction === "SORTING") {
    setLastTime("sort", lastTimes.sort + delta);
    if (lastTimes.sort > upgrade.time) {
      sort();
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
      startSort();
      setLastTime("autoSort", 0);
    }
  }
};
