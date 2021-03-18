import { Player } from "@botnet/messages";
import React, { useContext } from "react";

export type PlayerContextType = Player;

const PlayerContext = React.createContext<PlayerContextType>(undefined as any);

type PlayerProviderProps = {
  value: PlayerContextType;
  children: React.ReactNode;
};
export const PlayerProvider = ({ value, children }: PlayerProviderProps) => {
  return (
    <PlayerContext.Provider value={value}>{children} </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext not found");
  }
  return context;
};
