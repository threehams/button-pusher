import { UpgradeType } from "@botnet/messages";
import { PurchasedUpgradeMap } from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

export type Delay = (name: UpgradeType, callback: () => void) => void;
type DelayProps = {
  delta: number;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  upgrades: PurchasedUpgradeMap;
};
export const createDelay = ({
  lastTimes,
  setLastTime,
  delta,
  upgrades,
}: DelayProps) => (name: UpgradeType, callback: () => void) => {
  setLastTime(name, lastTimes[name] + delta);
  if (lastTimes[name] > upgrades[name].time) {
    callback();
    setLastTime(name, 0);
    return true;
  }
};
