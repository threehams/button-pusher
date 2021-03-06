import { useStoreValue } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { InventoryItem } from "../InventoryItem";
import { InventorySlot } from "../InventorySlot";

export const HeldItemPanel = () => {
  const { addSlot, moveSlot, heldSlot } = useStoreValue();
  const theme = useTheme();
  return (
    <div
      css={css`
        height: ${4 * theme.tileSize}px;
        width: ${2 * theme.tileSize}px;
        outline: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
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
          <InventoryItem
            moveSlot={moveSlot}
            addSlot={addSlot}
            item={heldSlot.item}
            slotId={heldSlot.id}
          />
        </InventorySlot>
      )}
    </div>
  );
};
