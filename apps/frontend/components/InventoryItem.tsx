import { Item } from "@botnet/messages";
import { isNonNullable } from "@botnet/utils";
import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { ItemTile } from "./ItemTile";
import { useDraggable } from "@dnd-kit/core";

type InventoryItemProps = {
  item: Item;
  dragId: string;
  className?: string;
  style?: CSSProperties;
};
export const InventoryItem = React.memo(
  ({ item, dragId, className, style }: InventoryItemProps) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<
      | {
          x: number;
          y: number;
        }
      | undefined
    >(undefined);
    const { listeners, attributes, setNodeRef, isDragging, transform } =
      useDraggable({
        id: dragId,
      });

    return (
      <>
        <ItemTile
          {...attributes}
          {...listeners}
          style={{
            ...style,
            transform: transform
              ? `translate3d(${transform.x}px, ${transform.y}px, 1px)`
              : "none",
          }}
          onMouseEnter={() => {
            setTooltipOpen(true);
          }}
          onMouseOut={() => {
            setTooltipOpen(false);
          }}
          onMouseMove={(event) => {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
          }}
          ref={setNodeRef}
          item={item}
          className={className}
        />
        {tooltipOpen && !isDragging && (
          <Tooltip item={item} position={tooltipPosition}></Tooltip>
        )}
      </>
    );
  },
);

type TooltipProps = {
  item: Item;
  position: { x: number; y: number } | undefined;
};
const Tooltip = ({ item, position }: TooltipProps) => {
  if (!position) {
    return null;
  }
  const prefix = item.modifiers.find((modifier) => modifier.type === "PREFIX");
  const suffix = item.modifiers.find((modifier) => modifier.type === "SUFFIX");
  const itemName = [prefix?.name, item.name, suffix?.name]
    .filter(isNonNullable)
    .join(" ");

  return ReactDOM.createPortal(
    <div
      style={{
        maxWidth: 350,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="absolute bg-gray-900 border-gray-50 left-0 p-3 pointer-events-none top-0 z-50"
    >
      <div>{itemName}</div>
      <p>{item.rarity}</p>
      <p>${item.value}</p>
      {!!item.modifiers.length && (
        <ul>
          {item.modifiers.map((modifier) => {
            return (
              <li key={modifier.name}>
                {modifier.power > 1 ? "+" : "-"}
                {modifier.stat}
              </li>
            );
          })}
        </ul>
      )}
    </div>,
    document.querySelector("#tooltip")!,
  );
};
