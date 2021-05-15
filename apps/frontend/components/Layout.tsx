import React from "react";
import { InventoryPanel, HeldItemPanel, UpgradePanel } from ".";
import { CustomDragLayer } from "./DragLayer";
import { ActionPanel } from "./Panels/ActionPanel";
import { StatusBar } from "./StatusBar";
import { useSelector } from "react-redux";
import { selectFloor, selectInventory } from "@botnet/store";
import { usePlayerId } from "../hooks/PlayerContext";

export const Layout = React.memo(() => {
  const playerId = usePlayerId();
  const player = useSelector((state) => state.players[playerId]);
  const moneys = useSelector((state) => state.players[playerId].moneys.moneys);
  const inventory = useSelector((state) => {
    return selectInventory(state, {
      containerId: state.players[playerId].inventory.currentContainerId,
      playerId,
    });
  });
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location.location, playerId }),
  );

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 items-start justify-center mx-auto max-w-7xl"
      style={{
        gridTemplateAreas: `"header header header"
      "inventory inventory inventory"
      "floor floor floor"
      "upgrades upgrades upgrades"`,
        gridTemplateRows: "auto auto 1fr",
        gridTemplateColumns: "1fr 1fr 1fr",
      }}
    >
      <>
        <CustomDragLayer />
        <header style={{ gridArea: "header" }} className="flex justify-between">
          <h2 className="mr-4">{player?.name}</h2>
          <div className="mr-10">${Math.floor(moneys)}</div>
          <div className="flex-auto">
            <StatusBar />
          </div>
          <div className="ml-10">
            Location:{" "}
            {player.location.location === "TOWN" ? "Town" : "Killing Fields"}
          </div>
        </header>
        <div
          style={{ gridArea: "inventory" }}
          className="align-items-center flex flex-nowrap"
        >
          <div className="mt-20 w-40">
            <HeldItemPanel />
          </div>
          <div className="justify-self-end w-full">
            <InventoryPanel inventory={inventory} />
          </div>
        </div>
        <div className="pt-3" style={{ gridArea: "floor" }}>
          <h2 className="mb-2">Floor</h2>
          {floor && <InventoryPanel inventory={floor} />}
        </div>
        <div className="pt-3" style={{ gridArea: "upgrades" }}>
          <div className="flex flex-row flex-nowrap">
            <div className="pr-3 w-1/2">
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
});
