import { Item } from "@botnet/messages";
import { AddSlot, MoveSlot } from "@botnet/store";
import { isNonNullable } from "@botnet/utils";
import { css } from "@emotion/react";
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import { DraggableItem, DraggableResult } from "./DraggableItem";
import { ItemTile } from "./ItemTile";

type InventoryItemProps = {
  item: Item;
  slotId?: string;
  className?: string;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const InventoryItem = React.memo(
  ({ item, slotId, className, addSlot, moveSlot }: InventoryItemProps) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<
      | {
          x: number;
          y: number;
        }
      | undefined
    >(undefined);
    const [{ isDragging }, drag, preview] = useDrag<
      DraggableItem,
      DraggableResult,
      { isDragging: boolean }
    >({
      item: {
        type: "ITEM",
        item,
        slotId,
      },
      collect: (monitor) => {
        return {
          isDragging: !!monitor.isDragging(),
        };
      },
      end: (_, monitor) => {
        const result: DraggableResult | undefined = monitor.getDropResult();
        if (result) {
          const { x, y, containerId } = result;
          if (slotId) {
            moveSlot({ x, y, containerId, slotId });
          } else {
            addSlot({ x, y, containerId, itemId: item.id });
          }
        }
      },
    });
    preview(getEmptyImage());

    return (
      <>
        <ItemTile
          onMouseEnter={() => {
            setTooltipOpen(true);
          }}
          onMouseOut={() => {
            setTooltipOpen(false);
          }}
          onMouseMove={(event) => {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
          }}
          ref={drag}
          visible={!isDragging}
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
      css={css`
        max-width: 350px;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(${position.x}px, ${position.y}px);
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #060606;
        z-index: 100;
      `}
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
