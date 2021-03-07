import React, { useContext } from "react";

export type ProgressContextType = {
  killProgress: number;
  autoKillProgress: number;
  packProgress: number;
  autoPackProgress: number;
  autoSortProgress: number;
  sellProgress: number;
  autoSellProgress: number;
  travelProgress: number;
  autoTravelProgress: number;
  dropJunkProgress: number;
  autoDropJunkProgress: number;
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
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("ProgressContext not found");
  }
  return context;
};
