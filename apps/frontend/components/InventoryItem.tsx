import { Item } from "@botnet/messages";
import { isNonNullable } from "@botnet/utils";
import React, { CSSProperties, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { usePlayerId } from "../hooks/PlayerContext";
import { DraggableItem, DraggableResult } from "./DraggableItem";
import { ItemTile } from "./ItemTile";

type InventoryItemProps = {
  item: Item;
  slotId?: string;
  className?: string;
  style?: CSSProperties;
};
export const InventoryItem = React.memo(
  ({ item, slotId, className, style }: InventoryItemProps) => {
    const dispatch = useDispatch();
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const playerId = usePlayerId();
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
      type: "ITEM",
      item: {
        item,
        slotId,
      },
      collect: (monitor) => {
        return {
          isDragging: !!monitor.isDragging(),
        };
      },
      end: (_, monitor) => {
        const result = monitor.getDropResult();
        if (result) {
          const { x, y, containerId } = result;
          if (slotId) {
            dispatch({
              type: "MOVE_SLOT",
              payload: { playerId, x, y, containerId, slotId },
            });
          } else {
            dispatch({
              type: "ADD_SLOT",
              payload: {
                playerId,
                x,
                y,
                containerId,
                itemId: item.id,
              },
            });
          }
        }
      },
    });
    preview(getEmptyImage());

    return (
      <>
        <ItemTile
          style={style}
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
      style={{
        maxWidth: 350,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="pointer-events-none absolute top-0 left-0 p-3 bg-gray border-gray-50 z-50"
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
