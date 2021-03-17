import { selectHeldSlot } from "@botnet/store";
import { theme } from "@botnet/ui";
import React from "react";
import { useSelector } from "react-redux";
import { InventoryItem } from "../InventoryItem";
import { InventorySlot } from "../InventorySlot";

export const HeldItemPanel = () => {
  const heldSlot = useSelector(selectHeldSlot);
  return (
    <div
      style={{
        height: 4 * theme.tileSize,
        width: 2 * theme.tileSize,
      }}
      className="border border-solid border-gray-50 flex items-center justify-center"
    >
      {heldSlot && (
        <InventorySlot
          containerId={heldSlot.containerId}
          setTarget={() => {}}
          canDrop={() => !heldSlot}
          x={0}
          y={0}
          width={2}
          height={4}
          required={false}
          state={heldSlot ? "VALID" : "INVALID"}
        >
          <InventoryItem item={heldSlot.item} slotId={heldSlot.id} />
        </InventorySlot>
      )}
    </div>
  );
};
