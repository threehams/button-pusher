import clsx from "clsx";
import React, { CSSProperties } from "react";
import { theme } from "@botnet/ui";
import { useDroppable } from "@dnd-kit/core";
import { serializeDragId } from "../lib/dragId";

type InventorySlotProps = {
  children?: React.ReactNode;
  state: "VALID" | "INVALID";
  required: boolean;
  x: number;
  y: number;
  width?: number;
  height?: number;
  containerId: string;
  slotId: string;
};
export const InventorySlot = React.memo(
  ({
    containerId,
    children,
    required,
    width = 1,
    height = 1,
    x,
    y,
    slotId,
    state,
    ...rest
  }: InventorySlotProps) => {
    return (
      <Slot
        height={height}
        required={required}
        state={state}
        width={width}
        dropId={serializeDragId({
          x,
          y,
          width,
          height,
          containerId,
          slotId,
        })}
        {...rest}
      >
        {children}
      </Slot>
    );
  },
);

type SlotProps = {
  width: number;
  height: number;
  required: boolean;
  state: "VALID" | "INVALID";
  children?: React.ReactNode;
  dropId: string;
};
const Slot = React.memo(
  ({
    height,
    required,
    state,
    width,
    children,
    dropId,
    ...rest
  }: SlotProps) => {
    const { setNodeRef } = useDroppable({
      id: dropId,
    });

    return (
      <button
        ref={setNodeRef}
        className="relative z-20 flex items-center justify-center border border-t-0 border-l-0 border-solid border-gray-50"
        style={{
          width: theme.tileSize * width,
          height: theme.tileSize * height,
        }}
        {...rest}
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
        "absolute bottom-0 h-full left-0 pointer-events-none right-0 top-0 w-full",
        className,
      )}
    ></div>
  );
};
