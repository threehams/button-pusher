import { Item } from "@botnet/messages";
import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { useDrag } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";

type InventoryItemProps = {
  item: Item;
  slotId?: string;
  className?: string;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const InventoryItem = React.memo(
  ({ item, slotId, className, addSlot, moveSlot }: InventoryItemProps) => {
    const theme = useTheme();
    const [{ isDragging }, drag] = useDrag<
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

    return (
      <img
        ref={drag}
        src={item.image}
        alt={item.name}
        css={css`
          position: relative;
          z-index: 3;
          cursor: pointer;
          filter: Chroma(Color = #000000) Glow(Color=#00FF00, Strength=20);
          width: ${item.width * theme.tileSize}px;
          height: ${item.height * theme.tileSize}px;
          opacity: ${isDragging ? 0 : 1};
          pointer-events: ${isDragging ? "none" : "auto"};
        `}
        className={className}
      />
    );
  },
);
