import { useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css } from "@emotion/react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HeldItemPanel, InventoryPanel, UpgradePanel } from "../components";
import { CustomDragLayer } from "../components/DragLayer";
import { Progress } from "../components/Progress";
import { useGameLoop } from "../hooks/gameLoop";

const fullQuotes = [
  "I can't carry any more.",
  "I am overburdened.",
  "Where would I put this?",
  "My bag is too heavy.",
];

export const Index = () => {
  const {
    storeHeldItem,
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
    loot,
    sort,
    adventure,
    arrive,
    playerAction,
    playerLocation,
    playerDestination,
    sellItem,
    travel,
  } = useStore();
  const {
    killProgress,
    packProgress,
    sellItemProgress,
    sellProgress,
    sortProgress,
    travelProgress,
  } = useGameLoop({
    adventure,
    storeHeldItem,
    arrive,
    playerAction,
    playerLocation,
    sellItem,
    travel,
    inventory,
    sort,
    availableItems,
    heldItem,
    pack,
    purchasedUpgradeMap,
    loot,
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
            <div>Moneys: ${Math.floor(moneys)}</div>
            {playerAction !== "TRAVELLING" && (
              <div>Location: {playerLocation}</div>
            )}
            {playerAction === "TRAVELLING" && (
              <div>
                Travelling to: {playerDestination}
                <Progress percent={travelProgress} />
              </div>
            )}
            <InventoryPanel
              buyContainerUpgrade={buyContainerUpgrade}
              inventory={inventory}
              addSlot={addSlot}
              moveSlot={moveSlot}
            />
            {playerLocation !== "TOWN" && playerAction !== "TRAVELLING" && (
              <button
                css={css`
                  display: block;
                `}
                onClick={() => {
                  travel({ destination: "TOWN" });
                }}
              >
                Travel to Town
              </button>
            )}
            {playerLocation === "TOWN" && playerAction !== "TRAVELLING" && (
              <button
                css={css`
                  display: block;
                `}
                onClick={() => {
                  travel({ destination: "KILLING_FIELDS" });
                }}
              >
                Travel to the Killing Fields
              </button>
            )}
            {playerLocation === "TOWN" &&
              playerAction !== "TRAVELLING" &&
              !!inventory.slots.length && (
                <button
                  css={css`
                    display: block;
                  `}
                  onClick={() => {
                    sellItem();
                  }}
                >
                  Sell Item
                </button>
              )}
            {playerLocation === "KILLING_FIELDS" &&
              playerAction === "IDLE" &&
              !heldItem && (
                <button
                  css={css`
                    display: block;
                  `}
                  onClick={() => {
                    adventure();
                  }}
                >
                  Kill something
                </button>
              )}
            {heldItem && playerAction === "IDLE" && !inventory.full && (
              <button
                css={css`
                  display: block;
                `}
                onClick={() => {
                  pack();
                }}
              >
                Store item
              </button>
            )}
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
            {playerAction === "KILLING" && (
              <>
                <Progress percent={killProgress} />
              </>
            )}
            <HeldItemPanel
              addSlot={addSlot}
              moveSlot={moveSlot}
              item={heldItem}
            />
            {heldItem && <div>{fullQuotes[1]}</div>}
          </Box>
        </>
      </Box>
    </DndProvider>
  );
};

export default Index;
