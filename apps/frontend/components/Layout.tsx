import React from "react";
import { InventoryPanel, HeldItemPanel, UpgradePanel } from ".";
import { CustomDragLayer } from "./DragLayer";
import { ActionPanel } from "./Panels/ActionPanel";
import { StatusBar } from "./StatusBar";
import { dialogue } from "@botnet/data";
import { useSelector } from "react-redux";
import { selectFloor, selectHeldSlot, selectInventory } from "@botnet/store";

export const Layout = () => {
  const moneys = useSelector((state) => state.data.moneys);
  const player = useSelector((state) => state.player);
  const heldSlot = useSelector(selectHeldSlot);
  const inventory = useSelector((state) => {
    return selectInventory(state, {
      containerId: state.data.currentContainerId,
    });
  });
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location }),
  );

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 items-start justify-center min-h-screen max-w-7xl mx-auto"
      style={{
        gridTemplateAreas: `"header header header"
      "inventory inventory hand"
      "floor floor floor"
      "upgrades upgrades upgrades"`,
        gridTemplateRows: "auto auto 1fr",
        gridTemplateColumns: "1fr 1fr 1fr",
      }}
    >
      <>
        <CustomDragLayer />
        <header style={{ gridArea: "header" }} className="flex justify-between">
          <div className="mr-10">${Math.floor(moneys)}</div>
          <div className="flex-auto">
            <StatusBar />
          </div>
          <div className="ml-10">
            Location: {player.location === "TOWN" ? "Town" : "Killing Fields"}
          </div>
        </header>
        <div
          style={{ gridArea: "inventory" }}
          className="w-full justify-self-end"
        >
          <InventoryPanel inventory={inventory} />
        </div>
        <div style={{ gridArea: "hand" }} className="w-full">
          <HeldItemPanel />
          {heldSlot && <div>{dialogue.overburdened[1]}</div>}
        </div>
        <div className="pt-3" style={{ gridArea: "floor" }}>
          <h2 className="mb-2">Floor</h2>
          <InventoryPanel inventory={floor} />
        </div>
        <div className="pt-3" style={{ gridArea: "upgrades" }}>
          <div className="flex flex-row flex-nowrap">
            <div className="w-1/2 pr-3">
              <ActionPanel />
            </div>
            <div className="w-1/2">
              <UpgradePanel />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
