import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrop } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type InventorySlotProps = {
  children?: React.ReactNode;
  state: "VALID" | "INVALID";
  required: boolean;
  canDrop: (target: Bounds) => boolean;
  setTarget: (target: Bounds | undefined) => void;
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
        const { width, height } = draggable.item;
        return canDrop({ x, y, width, height });
      },
      hover: (draggable) => {
        const { width, height } = draggable.item;
        setTarget({ x, y, width, height });
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
