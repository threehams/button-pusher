import { UpgradeType } from "@botnet/messages";
import { useImmer } from "use-immer";

export const INITIAL_LAST_TIMES: { [Key in UpgradeType]: number } = {
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
export type AllTimes = {
  [key: string]: LastTimes;
};
export type SetLastTime = (options: {
  name: keyof LastTimes;
  value: number;
  playerId: string;
}) => void;

export const useLastTimes = () => {
  const [allTimes, setLastTimesState] = useImmer<AllTimes>({});
  const setLastTime: SetLastTime = ({ name, value, playerId }) => {
    setLastTimesState((draft) => {
      draft[playerId] ??= INITIAL_LAST_TIMES;
      draft[playerId]![name] = value;
    });
  };
  const getPlayerTimes = (playerId: string) => {
    return allTimes[playerId] ?? INITIAL_LAST_TIMES;
  };
  return { allTimes, getPlayerTimes, setLastTime } as const;
};
