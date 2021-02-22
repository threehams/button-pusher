import { useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css } from "@emotion/react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HeldItemPanel, InventoryPanel } from "../components";
import { TerminalOverlay } from "../components/TerminalOverlay";
import { useGameLoop } from "../hooks/useGameLoop";

export const Index = () => {
  const {
    heldItem,
    inventory,
    setHeldItem,
    items,
    addSlot,
    moveSlot,
  } = useStore();

  useGameLoop({ setHeldItem, heldItem, items });
  return (
    <DndProvider backend={HTML5Backend}>
      <TerminalOverlay />
      <Box
        css={css`
          display: grid;
          grid-template-areas: "sidebar main";
          grid-template-columns: 75% 25%;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        `}
      >
        <>
          <Box
            css={css`
              grid-area: sidebar;
              justify-self: flex-end;
            `}
            paddingLeft={2}
            paddingTop={1}
          >
            <InventoryPanel
              inventory={inventory}
              addSlot={addSlot}
              moveSlot={moveSlot}
            />
          </Box>
          <Box
            css={css`
              grid-area: main;
            `}
            paddingX={1}
            paddingY={1}
          >
            <HeldItemPanel item={heldItem} />
          </Box>
        </>
      </Box>
    </DndProvider>
  );
};

export default Index;
