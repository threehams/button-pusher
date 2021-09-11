import React, { useState } from "react";
import { InventoryPanel, HeldItemPanel, UpgradePanel } from ".";
import { ActionPanel } from "./Panels/ActionPanel";
import { StatusBar } from "./StatusBar";
import { useSelector } from "react-redux";
import {
  getTargetCoords,
  selectFloor,
  selectHeldSlot,
  selectInventory,
} from "@botnet/store";
import { usePlayerId } from "../hooks/PlayerContext";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
} from "@dnd-kit/core";
import { deserializeDragId } from "../lib/dragId";
import { CanDrop } from "../lib/canDrop";
import { useDispatch } from "react-redux";

type DragItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  containerId: string;
  slotId: string;
};

export const Layout = React.memo(() => {
  const dispatch = useDispatch();
  const playerId = usePlayerId();
  const player = useSelector((state) => state.players[playerId]);
  const moneys = useSelector((state) => state.players[playerId].moneys.moneys);
  const inventory = useSelector((state) => {
    return selectInventory(state, {
      containerId: state.players[playerId].inventory.currentContainerId,
      playerId,
    });
  });
  const heldSlot = useSelector((state) => selectHeldSlot(state, { playerId }));
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location.location, playerId }),
  );
  const [movingItem, setMovingItem] = useState<DragItem | null>(null);
  const [targetItem, setTargetItem] = useState<DragItem | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    setMovingItem(deserializeDragId(event.active.id));
  };
  const onDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setTargetItem(null);
      return;
    }
    setTargetItem(deserializeDragId(event.over.id));
  };
  const onDragEnd = (event: DragEndEvent) => {
    if (event.active && event.over) {
      const { slotId } = deserializeDragId(event.active.id);
      const { containerId, x, y } = deserializeDragId(event.over.id);
      dispatch({
        type: "MOVE_SLOT",
        payload: {
          playerId,
          slotId,
          x,
          y,
          containerId,
        },
      });
    }
    setMovingItem(null);
    setTargetItem(null);
  };
  const onDragCancel = () => {
    setMovingItem(null);
    setTargetItem(null);
  };

  const canDrop: CanDrop = ({
    x,
    y,
    containerId,
  }): { required: boolean; valid: boolean } => {
    if (!movingItem || !targetItem || targetItem.containerId !== containerId) {
      return { valid: false, required: false };
    }
    const container =
      heldSlot?.containerId === containerId
        ? heldSlot
        : floor?.id === containerId
        ? floor
        : inventory;

    const targetCoords = getTargetCoords({
      inventory: container,
      target: {
        height: movingItem.height,
        width: movingItem.width,
        slotId: movingItem.slotId,
        x: targetItem.x,
        y: targetItem.y,
      },
    });
    return {
      valid: targetCoords?.valid ?? false,
      required: targetCoords?.required.includes(`${x},${y}`) ?? false,
    };
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <div
        className="grid grid-cols-3 grid-rows-3 items-start justify-center max-w-7xl mx-auto"
        style={{
          gridTemplateAreas: `"header header"
      "inventory upgrades"
      "floor upgrades"
      "floor upgrades"`,
          gridTemplateRows: "auto",
          gridTemplateColumns: "700px 1fr",
        }}
      >
        <>
          <header
            style={{ gridArea: "header" }}
            className="flex justify-between"
          >
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
          <div className="pt-3" style={{ gridArea: "inventory" }}>
            <h1 className="mb-3">Character</h1>
            <div className="flex flex-nowrap items-center">
              <div className="mt-20 mr-[40px]">
                <HeldItemPanel canDrop={canDrop} />
              </div>
              <div className="justify-self-end w-full">
                <InventoryPanel inventory={inventory} canDrop={canDrop} />
              </div>
            </div>
          </div>
          <div className="pt-3" style={{ gridArea: "floor" }}>
            <h2 className="mb-2">Floor</h2>
            {floor && <InventoryPanel inventory={floor} canDrop={canDrop} />}
          </div>
          <div className="pt-3" style={{ gridArea: "upgrades" }}>
            <h1 className="mb-3">Actions</h1>
            <ActionPanel />
            <h1 className="mb-3">Upgrades</h1>
            <UpgradePanel />
          </div>
        </>
      </div>
    </DndContext>
  );
});
