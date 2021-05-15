import { SlotInfo } from "@botnet/store";
import clsx from "clsx";
import React, { CSSProperties, Dispatch, SetStateAction } from "react";
import { ConnectDropTarget, useDrop } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";
import { theme } from "@botnet/ui";
import deepEqual from "deep-equal";

type InventorySlotProps = {
  children?: React.ReactNode;
  state: "VALID" | "INVALID";
  required: boolean;
  canDrop: (target: SlotInfo) => boolean;
  setTarget: Dispatch<SetStateAction<SlotInfo | undefined>>;
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
        setTarget((current) => {
          const target = {
            x,
            y,
            width: item.width,
            height: item.height,
            slotId,
          };
          if (!deepEqual(current, target)) {
            return target;
          }
          return current;
        });
      },
      drop: () => {
        setTarget(undefined);
        return { x, y, containerId };
      },
    });

    return (
      <Slot
        drop={drop}
        height={height}
        required={required}
        state={state}
        width={width}
      >
        {children}
      </Slot>
    );
  },
);

type SlotProps = {
  drop: ConnectDropTarget;
  width: number;
  height: number;
  required: boolean;
  state: "VALID" | "INVALID";
  children?: React.ReactNode;
};
const Slot = React.memo(
  ({ drop, height, required, state, width, children }: SlotProps) => {
    return (
      <button
        ref={drop}
        className="border border-gray-50 border-l-0 border-solid border-t-0 flex items-center justify-center relative z-20"
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
      className={clsx(
        "absolute bottom-0 h-full left-0 pointer-events-none right-0 top-0 w-full z-10",
        className,
      )}
    ></div>
  );
};
