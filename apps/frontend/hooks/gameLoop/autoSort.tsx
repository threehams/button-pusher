import { PurchasedUpgrade } from "@botnet/messages";
import { Inventory, Sort } from "@botnet/store";

const SORT_INTERVAL = 1000;

type AutoSort = {
  upgrade: PurchasedUpgrade;
  inventory: Inventory;
  lastSort: number;
  setLastSort: (value: number) => void;
  sort: Sort;
  delta: number;
};
export const autoSort = ({
  inventory,
  lastSort,
  setLastSort,
  sort,
  delta,
  upgrade,
}: AutoSort) => {
  if (!upgrade.level) {
    return;
  }
  setLastSort(lastSort + delta);
  if (lastSort > SORT_INTERVAL) {
    sort({
      containerId: inventory.id,
    });
    setLastSort(0);
  }
};
