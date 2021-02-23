import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrop } from "react-dnd";
import { DraggableItem } from "./DraggableItem";

type InventorySlotProps = {
  addSlot: AddSlot;
  children?: React.ReactNode;
  containerId: string;
  moveSlot: MoveSlot;
  x: number;
  y: number;
  available: boolean;
  availableRight: number;
  availableDown: number;
};
export const InventorySlot = ({
  children,
  x,
  y,
  containerId,
  addSlot,
  moveSlot,
  available,
  availableRight,
  availableDown,
}: InventorySlotProps) => {
  const theme = useTheme();
  const [, drop] = useDrop<DraggableItem, void, void>({
    accept: ["ITEM", "SLOT"],
    canDrop: (dragged) => {
      if (dragged.type === "ITEM") {
        const { width, height } = dragged.item;
        return !!(
          available &&
          width <= availableRight + 1 &&
          height <= availableDown + 1
        );
      } else {
        // const { id: slotId } = dragged.item;
        return false;
      }
    },
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
