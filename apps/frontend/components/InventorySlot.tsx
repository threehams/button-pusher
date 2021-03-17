import { SlotInfo } from "@botnet/store";
import classNames from "classnames";
import React, { CSSProperties } from "react";
import { useDrop } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";
import { theme } from "@botnet/ui";

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
    const [, drop] = useDrop<DraggableItem, DraggableResult, void>({
      accept: ["ITEM"],
      canDrop: (draggable) => {
        const { item, slotId } = draggable;
        return canDrop({
          x,
          y,
          width: item.width,
          height: item.height,
          slotId,
        });
      },
      hover: (draggable) => {
        const { item, slotId } = draggable;
        setTarget({ x, y, width: item.width, height: item.height, slotId });
      },
      drop: () => {
        setTarget(undefined);
        return { x, y, containerId };
      },
    });

    return (
      <button
        ref={drop}
        className="border border-solid border-gray-50 border-l-0 border-t-0 relative z-20 flex items-center justify-center"
        style={{
          width: theme.tileSize * width,
          height: theme.tileSize * height,
        }}
      >
        <Highlight
          style={{
            opacity: required && state === "INVALID" ? 1 : 0,
          }}
          className="bg-red-700"
        />
        <Highlight
          style={{
            opacity: required && state === "VALID" ? 1 : 0,
          }}
          className="bg-green-700"
        />
        {children}
      </button>
    );
  },
);

type HighlightProps = {
  className: string;
  style: CSSProperties;
};
const Highlight = ({ className, style }: HighlightProps) => {
  return (
    <div
      style={style}
      className={classNames(
        "pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-10 w-full h-full",
        className,
      )}
    ></div>
  );
};
