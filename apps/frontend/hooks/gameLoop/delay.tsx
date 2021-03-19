import { UpgradeType } from "@botnet/messages";
import { PurchasedUpgradeMap } from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

export type Delay = (name: UpgradeType, callback: () => void) => void;
type DelayProps = {
  delta: number;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  upgrades: PurchasedUpgradeMap;
  playerId: string;
};
export const createDelay = ({
  lastTimes,
  setLastTime,
  delta,
  upgrades,
  playerId,
}: DelayProps) => (name: UpgradeType, callback: () => void) => {
  setLastTime({ name, value: lastTimes[name] + delta, playerId });
  if (lastTimes[name] > upgrades[name].time) {
    callback();
    setLastTime({ name, value: 0, playerId });
    return true;
  }
};
