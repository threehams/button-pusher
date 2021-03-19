import React, { useContext } from "react";

export type PlayerIdContextType = string;

const PlayerIdContext = React.createContext<PlayerIdContextType>(
  undefined as any,
);

type PlayerIdProviderProps = {
  value: PlayerIdContextType;
  children: React.ReactNode;
};
export const PlayerIdProvider = ({
  value,
  children,
}: PlayerIdProviderProps) => {
  return (
    <PlayerIdContext.Provider value={value}>
      {children}{" "}
    </PlayerIdContext.Provider>
  );
};

export const usePlayerId = () => {
  const context = useContext(PlayerIdContext);
  if (!context) {
    throw new Error("PlayerIdContext not found");
  }
  return context;
};
