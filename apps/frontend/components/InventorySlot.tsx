import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrop } from "react-dnd";
import { DraggableItem } from "./DraggableItem";

type InventorySlotProps = {
  addSlot: AddSlot;
  moveSlot: MoveSlot;
  children: React.ReactNode;
  x: number;
  y: number;
  containerId: string;
};
export const InventorySlot = ({
  children,
  x,
  y,
  containerId,
  addSlot,
  moveSlot,
}: InventorySlotProps) => {
  const theme = useTheme();
  const [, drop] = useDrop<DraggableItem, void, void>({
    accept: ["ITEM", "SLOT"],
    drop: (dragged) => {
      if (dragged.type === "ITEM") {
        const { id: itemId } = dragged.item;
        addSlot({ itemId, x, y, containerId });
      } else {
        const { id: slotId } = dragged.item;
        moveSlot({ slotId, x, y, containerId });
      }
    },
  });

  return (
    <button
      ref={drop}
      css={css`
        border: 1px solid white;
        width: ${theme.tileSize};
        height: ${theme.tileSize};
      `}
    >
      {children}
    </button>
  );
};
