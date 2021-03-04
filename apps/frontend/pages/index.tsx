import { StoreProvider, useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css } from "@emotion/react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HeldItemPanel, InventoryPanel, UpgradePanel } from "../components";
import { CustomDragLayer } from "../components/DragLayer";
import { ActionPanel } from "../components/Panels/ActionPanel";
import { StatusBar } from "../components/StatusBar";
import { useGameLoop } from "../hooks/gameLoop";

const fullQuotes = [
  "I can't carry any more.",
  "I am overburdened.",
  "Where would I put this?",
  "My bag is too heavy.",
];

export const Index = () => {
  const store = useStore();
  const { moneys, heldItem, playerLocation } = store;
  const {
    killProgress,
    packProgress,
    autoSellProgress,
    sellProgress,
    travelProgress,
    autoKillProgress,
    autoPackProgress,
    autoTravelProgress,
  } = useGameLoop(store);

  return (
    <StoreProvider value={store}>
      <DndProvider backend={HTML5Backend}>
        <Box
          css={css`
            display: grid;
            grid-template-areas:
              "header header header"
              "inventory inventory hand"
              "upgrades upgrades upgrades";
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto auto 1fr;
            align-items: flex-start;
            justify-content: center;
            min-height: 100vh;
            max-width: 1280px;
            margin-right: auto;
            margin-left: auto;
          `}
        >
          <>
            <CustomDragLayer />
            <div
              css={css`
                grid-area: header;
                display: flex;
                justify-content: space-between;
              `}
            >
              <div
                css={css`
                  margin-right: 40px;
                `}
              >
                ${Math.floor(moneys)}
              </div>
              <div
                css={css`
                  flex: 1 1 auto;
                `}
              >
                <StatusBar
                  autoKillProgress={autoKillProgress}
                  autoPackProgress={autoPackProgress}
                  autoSellProgress={autoSellProgress}
                  autoTravelProgress={autoTravelProgress}
                  packProgress={packProgress}
                  travelProgress={travelProgress}
                />
              </div>
              <div
                css={css`
                  margin-left: 40px;
                `}
              >
                Location:{" "}
                {playerLocation === "TOWN" ? "Town" : "Killing Fields"}
              </div>
            </div>
            <Box
              css={css`
                width: 100%;
                grid-area: inventory;
                justify-self: flex-end;
              `}
            >
              <InventoryPanel />
            </Box>
            <Box
              css={css`
                grid-area: hand;
                width: 100%;
              `}
            >
              <HeldItemPanel />
              {heldItem && <div>{fullQuotes[1]}</div>}
            </Box>
            <Box
              css={css`
                padding-top: 20px;
                grid-area: upgrades;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex: row nowrap;
                `}
              >
                <div
                  css={css`
                    width: 50%;
                    padding-right: 20px;
                    & > * {
                      margin-bottom: 10px;
                    }
                  `}
                >
                  <ActionPanel
                    killProgress={killProgress}
                    packProgress={packProgress}
                    sellProgress={sellProgress}
                    travelProgress={travelProgress}
                  />
                </div>
                <div
                  css={css`
                    width: 50%;
                  `}
                >
                  <UpgradePanel />
                </div>
              </div>
            </Box>
          </>
        </Box>
      </DndProvider>
    </StoreProvider>
  );
};

export default Index;
