import { Item } from "@botnet/messages";
import { AddSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { DraggableItem, DraggableResult } from "./DraggableItem";

type InventoryItemProps = {
  item: Item;
  slotId?: string;
  className?: string;
  addSlot: AddSlot;
};
export const InventoryItem = ({
  item,
  slotId,
  className,
  addSlot,
}: InventoryItemProps) => {
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
        addSlot({ x, y, containerId, itemId: item.id });
      }
    },
  });

  return (
    <img
      ref={drag}
      src={item.image}
      alt={item.name}
      css={css`
        width: ${item.width * theme.tileSize}px;
        height: ${item.height * theme.tileSize}px;
        opacity: ${isDragging ? 0 : 1};
      `}
      className={className}
    />
  );
};
