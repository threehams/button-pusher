import { Item } from "@botnet/messages";
import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { InventoryItem } from "../InventoryItem";

type HeldItemPanelProps = {
  item: Item | undefined;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const HeldItemPanel = ({
  addSlot,
  moveSlot,
  item,
}: HeldItemPanelProps) => {
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
      {item && (
        <InventoryItem moveSlot={moveSlot} addSlot={addSlot} item={item} />
      )}
    </div>
  );
};
