import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGameLoop } from "../hooks/gameLoop";
import { ProgressProvider } from "../hooks/ProgressContext";
import { Debug } from "./Debug";
import { Layout } from "./Layout";

export const Game = () => {
  const progress = useGameLoop();

  return (
    <ProgressProvider value={progress}>
      <DndProvider backend={HTML5Backend}>
        <Layout />
        <div id="tooltip"></div>
        <Debug />
      </DndProvider>
    </ProgressProvider>
  );
};
