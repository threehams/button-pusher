import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrop } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";

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
  const [, drop] = useDrop<DraggableItem, DraggableResult, void>({
    accept: ["ITEM"],
    canDrop: (dragged) => {
      if (dragged.slotId === "ITEM") {
        return false;
      } else {
        const { width, height } = dragged.item;
        return !!(
          available &&
          width <= availableRight + 1 &&
          height <= availableDown + 1
        );
      }
    },
    drop: () => {
      return { x, y };
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
