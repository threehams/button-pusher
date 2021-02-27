import { Item } from "@botnet/messages";
import { SetHeldItem } from "@botnet/store";
import { alea } from "seedrandom";

const random = alea();
const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(random() * arr.length)];
};

const KILL_INTERVAL = 1000;

type Kill = {
  heldItem: Item | undefined;
  setHeldItem: SetHeldItem;
  lastKill: React.MutableRefObject<number>;
  availableItems: Item[];
  delta: number;
};
export const kill = ({
  availableItems,
  delta,
  heldItem,
  setHeldItem,
  lastKill,
}: Kill) => {
  if (heldItem) {
    return;
  }
  lastKill.current = lastKill.current + delta;
  if (lastKill.current > KILL_INTERVAL) {
    setHeldItem(choice(availableItems).id);
    lastKill.current = 0;
  }
};
