import { useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css } from "@emotion/react";
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HeldItemPanel, InventoryPanel, UpgradePanel } from "../components";
import { CustomDragLayer } from "../components/DragLayer";
import { TerminalOverlay } from "../components/TerminalOverlay";
import { useGameLoop } from "../hooks/useGameLoop";

const fullQuotes = [
  "I can't carry any more.",
  "I am overburdened.",
  "Where would I put this?",
  "My bag is too heavy.",
];

export const Index = () => {
  const {
    addSlot,
    availableItems,
    availableUpgrades,
    buyContainerUpgrade,
    buyUpgrade,
    heldItem,
    inventory,
    moneys,
    moveSlot,
    pack,
    purchasedUpgradeMap,
    sell,
    setHeldItem,
  } = useStore();
  useGameLoop({
    availableItems,
    heldItem,
    pack,
    purchasedUpgradeMap,
    setHeldItem,
  });
  const [panel, setPanel] = useState<"Containers" | "Upgrades">("Containers");

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
          <CustomDragLayer />
          <Box
            css={css`
              grid-area: sidebar;
              justify-self: flex-end;
            `}
            paddingLeft={2}
            paddingTop={1}
          >
            <p>Moneys: {moneys.toFixed(2)}</p>
            {panel === "Containers" && (
              <InventoryPanel
                buyContainerUpgrade={buyContainerUpgrade}
                inventory={inventory}
                addSlot={addSlot}
                moveSlot={moveSlot}
              />
            )}
            {panel === "Upgrades" && <div />}
            <button
              css={css`
                display: block;
              `}
              onClick={() => {
                sell();
              }}
            >
              Sell All
            </button>
            <UpgradePanel
              buyUpgrade={buyUpgrade}
              upgrades={availableUpgrades}
            />
            <button
              css={css`
                display: block;
              `}
              onClick={() => {
                setPanel("Upgrades");
              }}
            >
              Buy Upgrades
            </button>
          </Box>
          <Box
            css={css`
              grid-area: main;
            `}
            paddingX={1}
            paddingY={1}
          >
            <HeldItemPanel
              addSlot={addSlot}
              moveSlot={moveSlot}
              item={heldItem}
            />
            {heldItem && <p>{fullQuotes[1]}</p>}
          </Box>
        </>
      </Box>
    </DndProvider>
  );
};

export default Index;
