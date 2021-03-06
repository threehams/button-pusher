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
  width?: number;
  height?: number;
  containerId: string;
};
export const InventorySlot = React.memo(
  ({
    children,
    canDrop,
    required,
    setTarget,
    width = 1,
    height = 1,
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
          border-right: 1px solid #888;
          border-bottom: 1px solid #888;
          width: ${theme.tileSize * width}px;
          height: ${theme.tileSize * height}px;
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <div
          css={css`
            pointer-events: none;
            position: absolute;
            background-color: red;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: ${required && state === "INVALID" ? 1 : 0};
            z-index: 1;
          `}
        />
        <div
          css={css`
            pointer-events: none;
            position: absolute;
            background-color: green;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: ${required && state === "VALID" ? 1 : 0};
            z-index: 1;
          `}
        />
        {children}
      </button>
    );
  },
);
