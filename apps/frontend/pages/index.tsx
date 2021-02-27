import { useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css } from "@emotion/react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HeldItemPanel, InventoryPanel, UpgradePanel } from "../components";
import { CustomDragLayer } from "../components/DragLayer";
import { useGameLoop } from "../hooks/gameLoop";

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
    sort,
  } = useStore();
  useGameLoop({
    full: inventory.full,
    containerId: inventory.id,
    sort,
    availableItems,
    heldItem,
    pack,
    purchasedUpgradeMap,
    setHeldItem,
    sell,
  });

  return (
    <DndProvider backend={HTML5Backend}>
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
            <InventoryPanel
              buyContainerUpgrade={buyContainerUpgrade}
              inventory={inventory}
              addSlot={addSlot}
              moveSlot={moveSlot}
            />
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
            {purchasedUpgradeMap.SORT.level ? (
              <button
                css={css`
                  display: block;
                `}
                onClick={() => {
                  sort({ containerId: inventory.id });
                }}
              >
                Sort
              </button>
            ) : null}
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
