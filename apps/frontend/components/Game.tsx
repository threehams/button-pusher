import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { useGameLoop } from "../hooks/gameLoop";
import { PlayerProvider } from "../hooks/PlayerContext";
import { ProgressProvider } from "../hooks/ProgressContext";
import { Debug } from "./Debug";
import { Layout } from "./Layout";

export const Game = () => {
  const progress = useGameLoop();
  const firstPlayerId = useSelector((state) => {
    return state.player.id;
  });
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const player = useSelector((state) => {
    if (!playerId) {
      return undefined;
    }
    return state.player;
  });

  useEffect(() => {
    if (!playerId) {
      setPlayerId(firstPlayerId);
    }
  }, [firstPlayerId, playerId]);

  if (!player) {
    return null;
  }

  return (
    <PlayerProvider value={player}>
      <ProgressProvider value={progress}>
        <DndProvider backend={HTML5Backend}>
          <Layout />
          <div id="tooltip"></div>
          <Debug />
        </DndProvider>
      </ProgressProvider>
    </PlayerProvider>
  );
};
