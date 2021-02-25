import { SlotInfo } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrop } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";

type InventorySlotProps = {
  children?: React.ReactNode;
  state: "VALID" | "INVALID";
  required: boolean;
  canDrop: (target: SlotInfo) => boolean;
  setTarget: (target: SlotInfo | undefined) => void;
  x: number;
  y: number;
  containerId: string;
};
export const InventorySlot = React.memo(
  ({
    children,
    canDrop,
    required,
    setTarget,
    state,
    x,
    y,
    containerId,
  }: InventorySlotProps) => {
    const theme = useTheme();
    const [, drop] = useDrop<DraggableItem, DraggableResult, void>({
      accept: ["ITEM"],
      canDrop: (draggable) => {
        const {
          item: { width, height },
          slotId,
        } = draggable;
        return canDrop({ x, y, width, height, slotId });
      },
      hover: (draggable) => {
        const {
          item: { width, height },
          slotId,
        } = draggable;
        setTarget({ x, y, width, height, slotId });
      },
      drop: () => {
        setTarget(undefined);
        return { x, y, containerId };
      },
    });

    return (
      <button
        ref={drop}
        css={css`
          border: 1px solid white;
          width: ${theme.tileSize};
          height: ${theme.tileSize};
          background-color: ${required && state === "VALID"
            ? "green"
            : required && state === "INVALID"
            ? "RED"
            : "transparent"};
        `}
      >
        {children}
      </button>
    );
  },
);
