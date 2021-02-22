import { Item } from "@botnet/messages";
import { css, useTheme } from "@emotion/react";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { DraggableItem } from "./DraggableItem";

type InventoryItemProps = {
  item: Item;
};
export const InventoryItem = ({ item }: InventoryItemProps) => {
  const imageRef = useRef<HTMLImageElement>(null!);
  const theme = useTheme();
  const [{ isDragging }, drag] = useDrag<
    DraggableItem,
    void,
    { isDragging: boolean }
  >({
    item: {
      type: "ITEM",
      item,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag}>
      <img
        ref={imageRef}
        src={item.image}
        alt={item.name}
        css={css`
          width: ${item.width * theme.tileSize}px;
          height: ${item.height * theme.tileSize}px;
          opacity: ${isDragging ? 0 : 1};
        `}
      />
    </div>
  );
};
