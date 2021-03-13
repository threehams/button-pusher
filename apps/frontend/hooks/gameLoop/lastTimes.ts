import { UpgradeType } from "@botnet/messages";
import { useState } from "react";

const INITIAL_LAST_TIMES: { [Key in UpgradeType]: number } = {
  kill: 0,
  autoKill: 0,
  pack: 0,
  autoPack: 0,
  sort: 0,
  autoSort: 0,
  travel: 0,
  autoTravel: 0,
  sell: 0,
  autoSell: 0,
  dropJunk: 0,
  autoDropJunk: 0,
  trash: 0,
  autoTrash: 0,
};

export type LastTimes = typeof INITIAL_LAST_TIMES;
export type SetLastTime = (name: keyof LastTimes, value: number) => void;

export const useLastTimes = () => {
  const [lastTimes, setLastTimesState] = useState(INITIAL_LAST_TIMES);
  const setLastTime: SetLastTime = (name, value) => {
    setLastTimesState((current) => ({
      ...current,
      [name]: value,
    }));
  };
  return [lastTimes, setLastTime] as const;
};
