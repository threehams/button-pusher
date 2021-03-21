import { PlayerState } from "@botnet/store";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useGameLoop } from "../hooks/gameLoop";
import { PlayerIdProvider } from "../hooks/PlayerContext";
import { ProgressProvider } from "../hooks/ProgressContext";
import { Button } from "./Button";
import { Debug } from "./Debug";
import { Layout } from "./Layout";

export const Game = () => {
  const dispatch = useDispatch();
  const progress = useGameLoop();
  const allPlayers = useSelector((state) => {
    return Object.values(state.players);
  });
  const [player, setPlayerId] = useFindOrCreatePlayer();

  if (!player?.id) {
    return null;
  }

  return (
    <PlayerIdProvider value={player.id}>
      <ProgressProvider value={progress}>
        <DndProvider backend={HTML5Backend}>
          <Layout />
          <Button
            onClick={() => {
              dispatch({
                type: "CREATE_PLAYER",
                payload: { name: "Killy McLootFast" },
              });
            }}
          >
            Create Player
          </Button>
          {allPlayers.map((play) => {
            return (
              <Button
                key={play.id}
                onClick={() => {
                  setPlayerId(play.id);
                }}
              >
                View {play.name}
              </Button>
            );
          })}
          <div id="tooltip"></div>
          <Debug />
        </DndProvider>
      </ProgressProvider>
    </PlayerIdProvider>
  );
};

const useFindOrCreatePlayer = () => {
  const dispatch = useDispatch();
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const firstPlayer: PlayerState | undefined = useSelector((state) => {
    return Object.values(state.players)[0];
  });
  const player = useSelector((state) => {
    if (!playerId) {
      return undefined;
    }
    return state.players[playerId];
  });

  useEffect(() => {
    if (!playerId && !firstPlayer) {
      dispatch({
        type: "CREATE_PLAYER",
        payload: { name: "Adventure McKillsStuff" },
      });
    } else if (!playerId && firstPlayer) {
      setPlayerId(firstPlayer.id);
    }
  }, [dispatch, firstPlayer, playerId]);

  return [player, setPlayerId] as const;
};
