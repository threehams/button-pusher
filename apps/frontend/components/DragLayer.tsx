import { Item } from "@botnet/messages";
import React from "react";
import { CSSProperties } from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { ItemTile } from "./ItemTile";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
  };
}

export const CustomDragLayer = () => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer<{
    item: Item;
    initialOffset: XYCoord | null;
    currentOffset: XYCoord | null;
    isDragging: boolean;
  }>((monitor) => ({
    item: monitor.getItem()?.item,
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles} id="drag-layer">
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <ItemTile item={item} visible={isDragging} preview />
      </div>
    </div>
  );
};
