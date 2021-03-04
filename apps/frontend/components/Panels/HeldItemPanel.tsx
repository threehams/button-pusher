import { useStoreValue } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { InventoryItem } from "../InventoryItem";

export const HeldItemPanel = () => {
  const { addSlot, moveSlot, heldItem } = useStoreValue();
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
      {heldItem && (
        <InventoryItem moveSlot={moveSlot} addSlot={addSlot} item={heldItem} />
      )}
    </div>
  );
};
