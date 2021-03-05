import { Inventory, PurchasedUpgrade, Sort } from "@botnet/store";

type AutoSort = {
  autoUpgrade: PurchasedUpgrade;
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
  autoUpgrade,
}: AutoSort) => {
  if (
    !autoUpgrade.level ||
    !autoUpgrade.enabled ||
    !inventory.full ||
    inventory.sorted
  ) {
    return;
  }
  setLastSort(lastSort + delta);
  if (lastSort > autoUpgrade.time) {
    sort({
      containerId: inventory.id,
    });
    setLastSort(0);
  }
};
