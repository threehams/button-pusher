import { PurchasedUpgrade } from "@botnet/messages";
import { Sort } from "@botnet/store";

const SORT_INTERVAL = 1000;

type AutoSort = {
  upgrade: PurchasedUpgrade;
  containerId: string;
  lastSort: React.MutableRefObject<number>;
  sort: Sort;
  delta: number;
};
export const autoSort = ({
  containerId,
  lastSort,
  sort,
  delta,
  upgrade,
}: AutoSort) => {
  if (!upgrade.level) {
    return;
  }
  lastSort.current = lastSort.current + delta;
  if (lastSort.current > SORT_INTERVAL) {
    sort({
      containerId,
    });
    lastSort.current = 0;
  }
};
