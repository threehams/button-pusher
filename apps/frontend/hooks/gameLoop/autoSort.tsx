import { PlayerAction } from "@botnet/messages";
import { Inventory, PurchasedUpgrade, Sort, StartSort } from "@botnet/store";

type AutoSort = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  inventory: Inventory;
  lastSort: number;
  setLastSort: (value: number) => void;
  lastAutoSort: number;
  setLastAutoSort: (value: number) => void;
  startSort: StartSort;
  sort: Sort;
  delta: number;
  playerAction: PlayerAction;
};
export const autoSort = ({
  upgrade,
  inventory,
  lastSort,
  setLastSort,
  startSort,
  setLastAutoSort,
  lastAutoSort,
  sort,
  delta,
  autoUpgrade,
  playerAction,
}: AutoSort) => {
  if (playerAction === "SORTING") {
    setLastSort(lastSort + delta);
    if (lastSort > upgrade.time) {
      sort();
      setLastSort(0);
    }
  }

  if (
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    inventory.full &&
    !inventory.sorted
  ) {
    setLastAutoSort(lastAutoSort + delta);
    if (lastAutoSort > autoUpgrade.time) {
      startSort();
      setLastAutoSort(0);
    }
  }
};
