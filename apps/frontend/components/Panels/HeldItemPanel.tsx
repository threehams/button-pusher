import { selectHeldSlot } from "@botnet/store";
import { theme } from "@botnet/ui";
import { usePlayerId } from "../../hooks/PlayerContext";
import React from "react";
import { useSelector } from "react-redux";
import { InventoryItem } from "../InventoryItem";
import { InventorySlot } from "../InventorySlot";
import { serializeDragId } from "apps/frontend/lib/dragId";
import { CanDrop } from "apps/frontend/lib/canDrop";

type Props = {
  canDrop: CanDrop;
};
export const HeldItemPanel = ({ canDrop }: Props) => {
  const playerId = usePlayerId();
  const heldSlot = useSelector((state) => selectHeldSlot(state, { playerId }));
  return (
    <div
      style={{
        height: 4 * theme.tileSize,
        width: 2 * theme.tileSize,
      }}
      className="border border-gray-50 border-solid flex items-center justify-center"
    >
      {heldSlot && (
        <InventorySlot
          slotId={heldSlot.id}
          containerId={heldSlot.containerId}
          x={0}
          y={0}
          width={2}
          height={4}
          required={
            canDrop({ x: 0, y: 0, containerId: heldSlot.containerId }).required
          }
          state={
            canDrop({ x: 0, y: 0, containerId: heldSlot.containerId }).valid
              ? "VALID"
              : "INVALID"
          }
          data-test="handSlot"
        >
          <InventoryItem
            item={heldSlot.item}
            dragId={serializeDragId({
              x: 0,
              y: 0,
              width: heldSlot.item.width,
              height: heldSlot.item.height,
              slotId: heldSlot.id,
              containerId: heldSlot.containerId,
            })}
            className="relative"
          />
        </InventorySlot>
      )}
    </div>
  );
};
