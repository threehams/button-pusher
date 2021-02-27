import { PurchasedUpgrade } from "@botnet/messages";
import { Sell } from "@botnet/store";

const SORT_INTERVAL = 1000;

type AutoSell = {
  full: boolean;
  upgrade: PurchasedUpgrade;
  lastSell: React.MutableRefObject<number>;
  sell: Sell;
  delta: number;
};
export const autoSell = ({
  full,
  lastSell,
  sell,
  delta,
  upgrade,
}: AutoSell) => {
  if (!upgrade.level || !full) {
    return;
  }
  lastSell.current = lastSell.current + delta;
  if (lastSell.current > SORT_INTERVAL) {
    sell();
    lastSell.current = 0;
  }
};
