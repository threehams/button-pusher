import { UpgradeType } from "@botnet/messages";
import { selectPurchasedUpgrades } from "@botnet/store";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { usePlayerId } from "./PlayerContext";

export type ProgressContextType = {
  [key: string]: { [Key in UpgradeType]: number };
};

const ProgressContext = React.createContext<ProgressContextType>(
  undefined as any,
);

type ProgressProviderProps = {
  value: ProgressContextType;
  children: React.ReactNode;
};
export const ProgressProvider = ({
  value,
  children,
}: ProgressProviderProps) => {
  return (
    <ProgressContext.Provider value={value}>
      {children}{" "}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const progress = useContext(ProgressContext);
  const playerId = usePlayerId();
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state, { playerId }),
  );
  if (!progress) {
    throw new Error("ProgressContext not found");
  }
  return Object.fromEntries(
    Object.entries(progress[playerId]).map(([name, lastTime]) => {
      return [name, (lastTime / purchasedUpgrades[name].time) * 100] as const;
    }),
  );
};
